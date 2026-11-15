import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  fetchOpenApiEndpoints,
  initialValues,
  loginNextUrl,
  logoutNextUrl,
  prettyJson,
  type ApiAuth,
  type ApiEndpoint,
  type ApiGroup,
  type ParamValues,
} from '../api/openApi';
import { fetchAuthMe, popOAuthError, type Me } from '../api/wikiContrib';
import CodeTabs, { copyToClipboard } from '../components/api/CodeTabs';
import ParamsTable from '../components/api/ParamsTable';
import ResponseModelTree from '../components/api/ResponseModelTree';
import TryPanel from '../components/api/TryPanel';
import './OpenApi.css';

const AUTH_BADGE: Record<ApiAuth, { label: string; cls: string }> = {
  none: { label: '公开', cls: 'ok' },
  session: { label: '需登录', cls: 'warn' },
  api_key: { label: 'Api-Key', cls: 'mute' },
};

const SIDE_COLLAPSED_KEY = 'openapi:side-collapsed';
const PANEL_OPEN_KEY = 'openapi:panel-open';
const VALUES_KEY = 'openapi:param-values';

/** 是否允许在文档页在线调试 */
function canTry(ep: ApiEndpoint): boolean {
  return ep.try_enabled && ep.auth !== 'api_key';
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export default function OpenApi() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState<ApiGroup[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authPhase, setAuthPhase] = useState<'loading' | 'anon' | 'user'>('loading');
  const [me, setMe] = useState<Me | null>(null);
  const [valuesMap, setValuesMap] = useState<Record<string, ParamValues>>(() =>
    readStored<Record<string, ParamValues>>(VALUES_KEY, {}),
  );
  const [panelOpen, setPanelOpen] = useState<boolean>(() =>
    readStored<boolean>(PANEL_OPEN_KEY, false),
  );
  // 侧栏折叠状态跨会话记忆（localStorage）
  const [sideCollapsed, setSideCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(SIDE_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [foldedGroups, setFoldedGroups] = useState<Record<string, boolean>>({});
  const [pathCopied, setPathCopied] = useState(false);
  // 后端 OAuth 失败时 redirect 带 ?error=... 回本页，开屏消费掉并展示。
  // StrictMode 下 effect 双执行：用「已有值不覆盖」避免第二次 pop 的 null 清掉状态
  const [oauthError, setOauthError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setGroups(null);
    const res = await fetchOpenApiEndpoints();
    if (res.kind === 'ok') setGroups(res.groups);
    else setError(res.message);
  }, []);

  useEffect(() => {
    load();
    setOauthError((prev) => prev ?? popOAuthError());
    let cancelled = false;
    (async () => {
      const me = await fetchAuthMe();
      if (cancelled) return;
      if (me.kind === 'ok') {
        setMe(me.user);
        setAuthPhase('user');
      } else {
        setAuthPhase('anon');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  // 面板开合与已填参数写入 sessionStorage：登录整页跳回后恢复现场
  useEffect(() => {
    try {
      sessionStorage.setItem(PANEL_OPEN_KEY, JSON.stringify(panelOpen));
    } catch { /* ignore */ }
  }, [panelOpen]);

  useEffect(() => {
    try {
      sessionStorage.setItem(VALUES_KEY, JSON.stringify(valuesMap));
    } catch { /* ignore */ }
  }, [valuesMap]);

  const toggleSide = () => {
    setSideCollapsed((v) => {
      try {
        localStorage.setItem(SIDE_COLLAPSED_KEY, v ? '0' : '1');
      } catch { /* ignore */ }
      return !v;
    });
  };

  const endpoints = useMemo(
    () => groups?.flatMap((g) => g.endpoints) ?? [],
    [groups],
  );

  const active: ApiEndpoint | null = useMemo(() => {
    const slug = searchParams.get('api');
    return endpoints.find((e) => e.slug === slug) ?? endpoints[0] ?? null;
  }, [endpoints, searchParams]);

  const values: ParamValues = useMemo(
    () => (active ? valuesMap[active.slug] ?? initialValues(active.params) : {}),
    [active, valuesMap],
  );

  const selectEndpoint = (slug: string) => {
    setSearchParams({ api: slug });
  };

  const setValue = (key: string, value: string) => {
    if (!active) return;
    setValuesMap((prev) => ({
      ...prev,
      [active.slug]: { ...(prev[active.slug] ?? initialValues(active.params)), [key]: value },
    }));
  };

  const copyPath = async () => {
    if (!active) return;
    if (await copyToClipboard(window.location.origin + active.path)) {
      setPathCopied(true);
      window.setTimeout(() => setPathCopied(false), 1600);
    }
  };

  const activeTryable = Boolean(active && canTry(active));

  return (
    <div className="open-api">
      {/* ============ HERO ============ */}
      <section className="open-api__hero">
        <div className="open-api__hero-grid" aria-hidden />
        <div className="container open-api__hero-inner">
          <p className="section-eyebrow">// 开放平台 · Open API</p>
          <nav className="open-api__crumbs" aria-label="breadcrumb">
            <Link to="/">首页</Link>
            <span>/</span>
            <span className="is-current">开放 API</span>
          </nav>
          <h1 className="open-api__title">
            <span className="glitch" data-text="开放 API">
              开放 API
            </span>
          </h1>
          <p className="open-api__desc">
            协会对外开放的 HTTP API 目录。查看每个接口的
            <span className="accent">请求参数</span>与
            <span className="accent">响应模型</span>
            ，复制为 Javascript / Python / Go 等多种语言的示例代码，或打开在线调试浮窗现场调用。
          </p>
        </div>
      </section>

      {/* ============ 主体 ============ */}
      <section className="section open-api__body-section">
        <div className="container open-api__container">
          {oauthError && (
            <div className="api-banner" role="alert">
              <span className="api-banner__label">// oauth error</span>
              <span className="api-banner__msg">{oauthError}</span>
              <button
                type="button"
                className="api-banner__close"
                onClick={() => setOauthError(null)}
                aria-label="关闭"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div className="api-card corner">
              <span className="api-card__label" style={{ color: 'var(--color-red)' }}>// error</span>
              <h2 className="api-card__title">无法加载 API 目录</h2>
              <p className="api-card__note">{error}</p>
              <div>
                <button type="button" className="api-btn api-btn--primary" onClick={load}>
                  重试
                </button>
              </div>
            </div>
          )}

          {!error && groups === null && (
            <div className="api-card corner api-card--center">
              <div className="api-loader" aria-hidden>
                <span /><span /><span />
              </div>
              <p className="api-card__note">// loading · fetching open api catalogue…</p>
            </div>
          )}

          {!error && groups !== null && endpoints.length === 0 && (
            <div className="api-card corner api-card--center">
              <span className="api-card__label">// empty</span>
              <h2 className="api-card__title">暂无开放的 API</h2>
              <p className="api-card__note">管理员可在 Django 后台（开放 API → 端点）添加并发布。</p>
            </div>
          )}

          {!error && groups !== null && endpoints.length > 0 && active && (
            <div className={`open-api__layout ${sideCollapsed ? 'open-api__layout--collapsed' : ''}`}>
              {sideCollapsed && (
                <button
                  type="button"
                  className="open-api__side-reopen"
                  onClick={toggleSide}
                  aria-label="展开 API 列表"
                >
                  ☰ API 列表
                </button>
              )}

              {/* —— 侧边栏 —— */}
              <aside className="open-api__side">
                <div className="api-side corner">
                  <div className="api-side__head">
                    <span className="api-card__label">// endpoints</span>
                    <button
                      type="button"
                      className="api-side__toggle"
                      onClick={toggleSide}
                      aria-label="收起 API 列表"
                    >
                      « 收起
                    </button>
                  </div>

                  {groups!.map((g) => {
                    const folded = Boolean(foldedGroups[g.slug]);
                    return (
                      <div key={g.slug} className="api-side__group">
                        <button
                          type="button"
                          className="api-side__group-title"
                          onClick={() =>
                            setFoldedGroups((prev) => ({ ...prev, [g.slug]: !folded }))
                          }
                          aria-expanded={!folded}
                        >
                          <span className={`api-side__group-arrow ${folded ? 'api-side__group-arrow--folded' : ''}`}>
                            ▼
                          </span>
                          {g.name}
                        </button>
                        {g.description && !folded && (
                          <p className="api-side__group-desc">{g.description}</p>
                        )}
                        {!folded && (
                          <ul className="api-side__list">
                            {g.endpoints.map((ep) => (
                              <li key={ep.slug}>
                                <button
                                  type="button"
                                  className={`api-side__item ${ep.slug === active.slug ? 'is-active' : ''}`}
                                  onClick={() => selectEndpoint(ep.slug)}
                                >
                                  <span className={`api-method api-method--${ep.method.toLowerCase()}`}>
                                    {ep.method}
                                  </span>
                                  <span className="api-side__item-name">{ep.name}</span>
                                  {ep.auth !== 'none' && (
                                    <span className="api-side__lock">{AUTH_BADGE[ep.auth].label}</span>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}

                  <div className="api-side__auth">
                    {authPhase === 'loading' && <span className="api-side__auth-note">…</span>}
                    {authPhase === 'anon' && (
                      <>
                        <span className="api-side__auth-note api-side__auth-note--anon">○ 未登录</span>
                        <a className="api-side__auth-link" href={loginNextUrl(active.slug)}>jAccount 登录</a>
                      </>
                    )}
                    {authPhase === 'user' && (
                      <>
                        <span className="api-side__auth-note api-side__auth-note--user">
                          ● 已登录为：{me?.display_name || me?.sjtu_account || '未知用户'}
                        </span>
                        <a className="api-side__auth-link" href={logoutNextUrl(active.slug)}>退出登录</a>
                      </>
                    )}
                  </div>
                </div>
              </aside>

              {/* —— 文档正文（纯展示） —— */}
              <div className="open-api__main">
                <article className="api-card corner">
                  <header className="api-ep-head">
                    <div className="api-ep-head__pathline">
                      <span className={`api-method api-method--lg api-method--${active.method.toLowerCase()}`}>
                        {active.method}
                      </span>
                      <code className="api-ep-head__path">{active.path}</code>
                      <button type="button" className="api-ep-head__copy" onClick={copyPath}>
                        [{pathCopied ? '已复制 ✓' : '复制路径'}]
                      </button>
                    </div>
                    <div className="api-ep-head__titlerow">
                      <h2 className="api-ep-head__title">{active.name}</h2>
                      <span className={`api-badge api-badge--${AUTH_BADGE[active.auth].cls}`}>
                        {AUTH_BADGE[active.auth].label}
                      </span>
                      {!active.try_enabled && <span className="api-badge api-badge--mute">仅文档</span>}
                    </div>
                    <p className="api-ep-head__summary">{active.summary}</p>
                    {activeTryable && (
                      <div>
                        <button
                          type="button"
                          className="api-btn api-btn--primary"
                          onClick={() => setPanelOpen((v) => !v)}
                        >
                          {panelOpen ? '收起调试面板' : '在线调试 ▶'}
                        </button>
                      </div>
                    )}
                    {(active.auth === 'api_key' || !active.try_enabled) && (
                      <p className="api-card__note">
                        {active.auth === 'api_key'
                          ? '该接口使用服务端保管的 Api-Key 请求头认证，不适合在浏览器里公开调用，请直接使用下方代码示例。'
                          : '该接口暂未开放在线调试。'}
                      </p>
                    )}
                  </header>
                </article>

                {/* 请求参数（只读文档） */}
                <article className="api-card corner">
                  <span className="api-card__label">// request params</span>
                  <h2 className="api-card__title">请求参数</h2>
                  <ParamsTable params={active.params} />
                </article>

                {/* 响应模型 */}
                <article className="api-card corner">
                  <span className="api-card__label">// response model</span>
                  <h2 className="api-card__title">响应模型</h2>
                  <ResponseModelTree nodes={active.response_model} />
                </article>

                {/* 响应示例 */}
                {active.responses.length > 0 && (
                  <ResponseExamplesCard endpoint={active} />
                )}

                {/* 代码生成（浮窗打开时随填写的参数实时更新） */}
                <article className="api-card corner">
                  <span className="api-card__label">// code snippets</span>
                  <h2 className="api-card__title">代码示例</h2>
                  <p className="api-card__note api-card__note--mb">
                    空缺参数已用默认值 / 示例值补齐{activeTryable ? '；在调试浮窗里修改参数后示例会同步更新' : ''}。
                  </p>
                  <CodeTabs endpoint={active} values={values} />
                </article>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* —— 在线调试浮窗 —— */}
      {!error && active && activeTryable && panelOpen && (
        <TryPanel
          endpoint={active}
          values={values}
          authPhase={authPhase}
          onClose={() => setPanelOpen(false)}
          onChange={setValue}
        />
      )}
    </div>
  );
}

/* ============ 响应示例卡片 ============ */

function ResponseExamplesCard({ endpoint }: { endpoint: ApiEndpoint }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const idx = Math.min(activeIdx, endpoint.responses.length - 1);
  const resp = endpoint.responses[idx];

  return (
    <article className="api-card corner">
      <span className="api-card__label">// response examples</span>
      <h2 className="api-card__title">响应示例</h2>
      <div className="api-code__tabs" role="tablist" aria-label="状态码">
        {endpoint.responses.map((r, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === idx}
            className={`api-code__tab ${i === idx ? 'is-active' : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            {r.status}
          </button>
        ))}
      </div>
      {resp.description && <p className="api-card__note api-card__note--mb">{resp.description}</p>}
      <pre className="api-code__pre">
        <code>{resp.example ? prettyJson(resp.example) : '// 无示例'}</code>
      </pre>
    </article>
  );
}
