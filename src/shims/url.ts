/**
 * Node legacy `url` 模块的最小浏览器 shim。
 *
 * 仅供 @readme/httpsnippet 在打包进浏览器时使用（其内部用 url.parse / url.format
 * 拆装 HAR 请求的 URL），语义以该库的实际调用形态为准，不追求完整复刻。
 */

interface LegacyUrl {
  protocol: string | null;
  slashes: boolean;
  auth: string | null;
  host: string | null;
  port: string | null;
  hostname: string | null;
  hash: string | null;
  search: string | null;
  query: Record<string, string> | null;
  pathname: string | null;
  path: string | null;
  href: string;
}

type FormatTarget = Partial<{
  [K in keyof LegacyUrl]: LegacyUrl[K] | null | undefined;
}>;

export function parse(urlStr: string, parseQueryString = false): LegacyUrl {
  const u = new URL(urlStr);
  const auth = u.password ? `${u.username}:${u.password}` : u.username;
  const out: LegacyUrl = {
    protocol: u.protocol || null,
    slashes: true,
    auth: auth || null,
    host: u.host || null,
    port: u.port || null,
    hostname: u.hostname || null,
    hash: u.hash || null,
    search: u.search || null,
    query: null,
    pathname: u.pathname || null,
    path: (u.pathname || '') + (u.search || ''),
    href: u.href,
  };
  if (parseQueryString && u.search) {
    const query: Record<string, string> = {};
    u.searchParams.forEach((v, k) => {
      query[k] = v;
    });
    out.query = query;
  }
  return out;
}

export function format(obj: FormatTarget | string): string {
  if (typeof obj === 'string') return obj;
  let out = obj.protocol || '';

  const host = obj.host ?? (obj.hostname != null ? `${obj.hostname}${obj.port ? ':' + obj.port : ''}` : null);
  if (host) {
    out += '//' + (obj.auth ? `${obj.auth}@` : '') + host;
  }

  // node 语义：search 缺省时用 query 对象拼 search；path 优先于 pathname+search
  let search = typeof obj.search === 'string' ? obj.search : '';
  if (!search && obj.query != null) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(obj.query)) sp.set(k, String(v));
    search = '?' + sp.toString();
  }
  out += obj.path || (obj.pathname || '') + search;
  out += obj.hash || '';
  return out;
}

export default { parse, format };
