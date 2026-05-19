/**
 * 用户中心 / Wiki 贡献相关后端 API 封装。
 */

/** OAuth 入口（整页跳转，不是 fetch） */
export const sjtuLoginUrl = '/auth/sjtu/login/';
export const githubBindStartUrl = '/auth/github/bind/';
export const logoutUrl = '/auth/logout/';

/** GET /auth/me 用户信息字段 */
export interface Me {
  sjtu_account: string;
  real_name: string;
  display_name: string;
  identity: string;
  student_number: string;
  college: string;
  uuid: string;
  /** 未绑定时是空字符串 */
  github_username: string;
  github_profile_url: string;
  github_bound_at: string | null;
}

export interface ContribItem {
  /** ISO 日期 YYYY-MM-DD，可能为 null（旧数据） */
  date: string | null;
  entry: string;
  /** 可正可负 */
  score: number;
}

export interface WikiData {
  total_score: number;
  contributions: ContribItem[];
}

interface AuthMeUnauth {
  authenticated: false;
}
interface AuthMeAuth {
  authenticated: true;
  user: Me;
  wiki: WikiData;
}
type AuthMeResp = AuthMeUnauth | AuthMeAuth;

export type FetchMeResult =
  | { kind: 'unauthenticated' }
  | { kind: 'ok'; user: Me; wiki: WikiData }
  | { kind: 'error'; message: string };

export async function fetchAuthMe(): Promise<FetchMeResult> {
  try {
    const resp = await fetch('/auth/me', {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!resp.ok) {
      return { kind: 'error', message: `HTTP ${resp.status}` };
    }
    const data = (await resp.json()) as AuthMeResp;
    if (!data.authenticated) return { kind: 'unauthenticated' };
    return { kind: 'ok', user: data.user, wiki: data.wiki };
  } catch (err) {
    return { kind: 'error', message: (err as Error).message };
  }
}

/** 从 location.search 抠出后端 OAuth 失败时拼回来的 ?error=... */
export function popOAuthError(): string | null {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  const err = url.searchParams.get('error');
  if (!err) return null;
  url.searchParams.delete('error');
  window.history.replaceState(null, '', url.toString());
  return err;
}
