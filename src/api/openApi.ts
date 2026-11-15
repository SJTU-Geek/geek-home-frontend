/**
 * 开放 API 文档门户相关后端 API 封装。
 * 数据来源：GET /api/openapi/endpoints/（Django openapi app 维护）。
 */

import { logoutUrl, sjtuLoginUrl } from './wikiContrib';

/** 认证方式 */
export type ApiAuth = 'none' | 'session' | 'api_key';

/** 请求参数位置 */
export type ApiParamLocation = 'query' | 'path' | 'header' | 'body';

/** 参数类型 */
export type ApiParamType = 'string' | 'integer' | 'number' | 'boolean' | 'enum' | 'array';

/** 请求参数描述（对应后端 ApiEndpoint.params 列表项） */
export interface ApiParam {
  name: string;
  location: ApiParamLocation;
  type: ApiParamType;
  required: boolean;
  /** 后端存的是字符串，缺省时作为表单初始值 */
  default?: string;
  example?: string;
  /** type === 'enum' 时可选值 */
  enum?: string[];
  description?: string;
}

/** 响应模型树节点（children 嵌套表示对象 / 数组元素） */
export interface ApiResponseModelNode {
  name: string;
  type: string;
  description?: string;
  children?: ApiResponseModelNode[];
}

/** 响应示例（对应后端 ApiEndpoint.responses 列表项） */
export interface ApiResponseExample {
  status: number;
  description?: string;
  /** 预格式化的 JSON 文本 */
  example?: string;
}

export interface ApiEndpoint {
  slug: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  /** 按空行分段的说明 */
  description: string[];
  auth: ApiAuth;
  params: ApiParam[];
  response_model: ApiResponseModelNode[];
  responses: ApiResponseExample[];
  try_enabled: boolean;
}

export interface ApiGroup {
  slug: string;
  name: string;
  description: string;
  endpoints: ApiEndpoint[];
}

export type FetchEndpointsResult =
  | { kind: 'ok'; groups: ApiGroup[]; count: number }
  | { kind: 'error'; message: string };

/** 登录 / 退出的回跳地址：保持停留在文档页并选中当前端点 */
function authReturnUrl(slug?: string): string {
  return slug ? `/open-api?api=${slug}` : '/open-api';
}

export function loginNextUrl(slug?: string): string {
  return `${sjtuLoginUrl}?next=${encodeURIComponent(authReturnUrl(slug))}`;
}

export function logoutNextUrl(slug?: string): string {
  return `${logoutUrl}?next=${encodeURIComponent(authReturnUrl(slug))}`;
}

/** 开放 API 统一响应结构（见后端 openapi/api_response.py） */
interface Envelope<T> {
  success: boolean;
  code: number;
  data: T;
  error_code: string | null;
  message: string;
}

export async function fetchOpenApiEndpoints(): Promise<FetchEndpointsResult> {
  try {
    const resp = await fetch('/api/openapi/endpoints/', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) {
      return { kind: 'error', message: `HTTP ${resp.status}` };
    }
    const envelope = (await resp.json()) as Envelope<{ count: number; groups: ApiGroup[] }>;
    if (!envelope.success || !envelope.data) {
      return { kind: 'error', message: envelope.message || `code ${envelope.code}` };
    }
    const data = envelope.data;
    return { kind: 'ok', groups: data.groups || [], count: data.count };
  } catch (err) {
    return { kind: 'error', message: (err as Error).message };
  }
}

/* ============ 在线调试：表单状态与请求构造 ============ */

/** 表单值：key 为 `${location}:${name}`，值统一存字符串（发送时按类型转换） */
export type ParamValues = Record<string, string>;

export function paramKey(p: ApiParam): string {
  return `${p.location}:${p.name}`;
}

/** 从参数默认值 / 示例构造初始表单 */
export function initialValues(params: ApiParam[]): ParamValues {
  const values: ParamValues = {};
  for (const p of params) {
    values[paramKey(p)] = p.default || p.example || '';
  }
  return values;
}

function coerceBoolean(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(v)) return 'true';
  if (['0', 'false', 'no', 'off', ''].includes(v)) return 'false';
  return null;
}

function coerceInteger(raw: string): string | null {
  if (!/^-?\d+$/.test(raw.trim())) return null;
  return raw.trim();
}

function coerceNumber(raw: string): string | null {
  if (raw.trim() === '' || Number.isNaN(Number(raw))) return null;
  return raw.trim();
}

/** 按参数类型转换表单值；非法时返回 null 并给出错误信息 */
export function coerceParam(p: ApiParam, raw: string): { value?: string; error?: string } {
  const v = raw.trim();
  if (!v) {
    if (p.required) return { error: `参数 ${p.name} 必填` };
    return { value: '' };
  }
  switch (p.type) {
    case 'boolean': {
      const b = coerceBoolean(v);
      return b === null ? { error: `参数 ${p.name} 需为布尔值（true/false）` } : { value: b };
    }
    case 'integer': {
      const n = coerceInteger(v);
      return n === null ? { error: `参数 ${p.name} 需为整数` } : { value: n };
    }
    case 'number': {
      const n = coerceNumber(v);
      return n === null ? { error: `参数 ${p.name} 需为数字` } : { value: n };
    }
    default:
      return { value: raw };
  }
}

export interface BuiltRequest {
  /** 替换路径参数后的请求路径（含 query） */
  url: string;
  method: string;
  headers: { name: string; value: string }[];
  /** body 参数组成的对象；无 body 参数时为 null */
  bodyJson: Record<string, unknown> | null;
}

/** 读 Django csrftoken cookie（GET /api/openapi/endpoints/ 时后端已 set） */
export function readCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** 把表单值按 endpoint 定义组装成实际请求 */
export function buildRequest(endpoint: ApiEndpoint, values: ParamValues): BuiltRequest {
  let url = endpoint.path;
  const query = new URLSearchParams();
  const headers: { name: string; value: string }[] = [{ name: 'Accept', value: 'application/json' }];
  const body: Record<string, unknown> = {};

  for (const p of endpoint.params) {
    const raw = values[paramKey(p)] ?? '';
    if (!raw) continue;
    switch (p.location) {
      case 'path':
        url = url.replace(`{${p.name}}`, encodeURIComponent(raw));
        break;
      case 'query':
        query.set(p.name, raw);
        break;
      case 'header':
        headers.push({ name: p.name, value: raw });
        break;
      case 'body':
        if (p.type === 'integer' || p.type === 'number') body[p.name] = Number(raw);
        else if (p.type === 'boolean') body[p.name] = raw === 'true';
        else body[p.name] = raw;
        break;
    }
  }

  const qs = query.toString();
  if (qs) url += (url.includes('?') ? '&' : '?') + qs;

  let bodyJson: Record<string, unknown> | null = null;
  if (UNSAFE_METHODS.has(endpoint.method)) {
    headers.push({ name: 'X-CSRFToken', value: readCsrfToken() });
    if (Object.keys(body).length > 0) {
      bodyJson = body;
      headers.push({ name: 'Content-Type', value: 'application/json' });
    }
  }

  return { url, method: endpoint.method, headers, bodyJson };
}

/** 实际发送在线调试请求，返回统一结构 */
export interface TryResult {
  status: number;
  statusText: string;
  durationMs: number;
  bodyText: string;
  ok: boolean;
}

export async function sendTryRequest(req: BuiltRequest): Promise<TryResult> {
  const started = performance.now();
  try {
    const init: RequestInit = {
      method: req.method,
      credentials: 'include',
      headers: req.headers.map((h) => [h.name, h.value] as [string, string]),
    };
    if (req.bodyJson !== null) init.body = JSON.stringify(req.bodyJson);
    const resp = await fetch(req.url, init);
    const text = await resp.text();
    return {
      status: resp.status,
      statusText: resp.statusText,
      durationMs: Math.round(performance.now() - started),
      bodyText: text,
      ok: resp.ok,
    };
  } catch (err) {
    return {
      status: 0,
      statusText: 'Network Error',
      durationMs: Math.round(performance.now() - started),
      bodyText: String((err as Error).message || err),
      ok: false,
    };
  }
}

/** 尽量美化 JSON 文本；失败则原样返回 */
export function prettyJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}
