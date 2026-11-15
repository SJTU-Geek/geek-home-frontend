/**
 * 请求代码生成：把（表单填好的）请求转成各语言的示例代码。
 *
 * cURL / JavaScript / Python / C# / Java / Go 用 @readme/httpsnippet（HAR 输入，
 * ReadMe 维护的 fork，浏览器可打包）；Raw HTTP 生成器为手写实现。
 */

import { HTTPSnippet, type HarRequest as LibHarRequest } from '@readme/httpsnippet';
import { buildRequest, paramKey, type ApiEndpoint, type ParamValues } from './openApi';

export interface SnippetLang {
  id: string;
  label: string;
}

/** 代码生成支持的格式（顺序即展示顺序） */
export const SNIPPET_LANGS: SnippetLang[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'http', label: 'Raw HTTP' },
  { id: 'js', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'csharp', label: 'C#' },
  { id: 'java', label: 'Java' },
  { id: 'go', label: 'Go' },
  { id: 'powershell', label: 'PowerShell' },
  { id: 'php', label: 'PHP' },
  { id: 'kotlin', label: 'Kotlin' },
];

type HarRequest = LibHarRequest;

/** @readme/httpsnippet 的目标 / 客户端字面量（须与其类型定义一致） */
type SnippetTarget =
  | 'shell'
  | 'javascript'
  | 'python'
  | 'csharp'
  | 'java'
  | 'go'
  | 'powershell'
  | 'php'
  | 'kotlin';
type SnippetClient =
  | 'curl'
  | 'fetch'
  | 'requests'
  | 'httpclient'
  | 'okhttp'
  | 'native'
  | 'webrequest';

/** 表单里空缺的参数用默认值 / 示例值补齐，让生成的代码开箱即用 */
function mergedValues(endpoint: ApiEndpoint, values: ParamValues): ParamValues {
  const merged: ParamValues = { ...values };
  for (const p of endpoint.params) {
    const key = paramKey(p);
    if (!merged[key]) merged[key] = p.default || p.example || '';
  }
  return merged;
}

function buildHar(endpoint: ApiEndpoint, values: ParamValues): HarRequest {
  const req = buildRequest(endpoint, mergedValues(endpoint, values));
  const url = new URL(req.url, window.location.origin);
  const base = {
    method: req.method,
    url: url.toString(),
    httpVersion: '1.1',
    queryString: [...url.searchParams.entries()].map(([name, value]) => ({ name, value })),
    headers: req.headers.map((h) => ({ name: h.name, value: h.value })),
    headersSize: -1,
    bodySize: -1,
    cookies: [],
  };
  if (req.bodyJson !== null) {
    return {
      ...base,
      postData: { mimeType: 'application/json', text: JSON.stringify(req.bodyJson, null, 2) },
    } as HarRequest;
  }
  // GET（无 body）分支：结构上与联合类型的 POST 分支不重叠，需经由 unknown 收窄
  return base as unknown as HarRequest;
}

/** 手写 Raw HTTP 报文（库自带的 http/http1.1 会丢 HTTP/ 前缀并改写头部大小写） */
function rawHttp(har: HarRequest): string {
  const url = new URL(har.url);
  const pathWithQuery = url.pathname + url.search;
  const lines = [`${har.method} ${pathWithQuery} HTTP/1.1`, `Host: ${url.host}`];
  for (const h of har.headers) lines.push(`${h.name}: ${h.value}`);
  const postData = (har as { postData?: { mimeType: string; text: string } }).postData;
  if (postData) {
    lines.push('Content-Length: ' + new TextEncoder().encode(postData.text).length);
    lines.push('', postData.text);
  }
  return lines.join('\n');
}

function convertWithSnippet(har: HarRequest, target: SnippetTarget, client: SnippetClient): string {
  const snippet = new HTTPSnippet(har);
  const out = snippet.convert(target, client);
  const text = Array.isArray(out) ? out.join('\n') : String(out ?? '');
  if (!text.trim()) throw new Error(`httpsnippet 未输出（${target}/${client}）`);
  return text;
}

/** 生成全部 7 种格式的代码；单种失败不影响其他格式（错误以注释呈现） */
export function generateSnippets(endpoint: ApiEndpoint, values: ParamValues): Record<string, string> {
  let har: HarRequest;
  try {
    har = buildHar(endpoint, values);
  } catch (err) {
    const msg = `// 请求构造失败：${(err as Error).message}`;
    return Object.fromEntries(SNIPPET_LANGS.map((l) => [l.id, msg]));
  }

  const out: Record<string, string> = {};
  for (const lang of SNIPPET_LANGS) {
    try {
      switch (lang.id) {
        case 'curl':
          out[lang.id] = convertWithSnippet(har, 'shell', 'curl');
          break;
        case 'http':
          out[lang.id] = rawHttp(har);
          break;
        case 'js':
          out[lang.id] = convertWithSnippet(har, 'javascript', 'fetch');
          break;
        case 'python':
          out[lang.id] = convertWithSnippet(har, 'python', 'requests');
          break;
        case 'csharp':
          out[lang.id] = convertWithSnippet(har, 'csharp', 'httpclient');
          break;
        case 'java':
          out[lang.id] = convertWithSnippet(har, 'java', 'okhttp');
          break;
        case 'go':
          out[lang.id] = convertWithSnippet(har, 'go', 'native');
          break;
        case 'powershell':
          out[lang.id] = convertWithSnippet(har, 'powershell', 'webrequest');
          break;
        case 'php':
          out[lang.id] = convertWithSnippet(har, 'php', 'curl');
          break;
        case 'kotlin':
          out[lang.id] = convertWithSnippet(har, 'kotlin', 'okhttp');
          break;
        default:
          out[lang.id] = `// 未知的代码格式：${lang.id}`;
      }
    } catch (err) {
      out[lang.id] = `// 代码生成失败：${(err as Error).message}`;
    }
  }
  return out;
}
