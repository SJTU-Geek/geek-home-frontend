import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAuthMe,
  githubBindStartUrl,
  logoutUrl,
  popOAuthError,
  sjtuLoginUrl,
  type ContribItem,
  type Me,
  type WikiData,
} from '../api/wikiContrib';
import './WikiContrib.css';

type Phase =
  | { kind: 'loading' }
  | { kind: 'ready'; me: Me; wiki: WikiData }
  | { kind: 'error'; message: string };

export default function WikiContrib() {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });
  const [oauthError, setOauthError] = useState<string | null>(null);

  useEffect(() => {
    // 后端 OAuth 失败时 redirect 带 ?error=...，开屏先消费掉
    setOauthError(popOAuthError());

    let cancelled = false;
    (async () => {
      const res = await fetchAuthMe();
      if (cancelled) return;

      if (res.kind === 'unauthenticated') {
        // 未登录 → 直接整页跳转 jAccount OAuth 入口
        window.location.href = sjtuLoginUrl;
        return;
      }
      if (res.kind === 'error') {
        setPhase({
          kind: 'error',
          message: `无法获取用户信息：${res.message}`,
        });
        return;
      }
      setPhase({ kind: 'ready', me: res.user, wiki: res.wiki });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="wiki-contrib">
      <section className="wiki-contrib__hero">
        <div className="wiki-contrib__hero-grid" aria-hidden />
        <div className="container wiki-contrib__hero-inner">
          <p className="section-eyebrow">// 用户中心 · Wiki Contribution</p>
          <nav className="wiki-contrib__crumbs" aria-label="breadcrumb">
            <Link to="/products">产品</Link>
            <span>/</span>
            <span>Wiki</span>
            <span>/</span>
            <span className="is-current">贡献中心</span>
          </nav>
          <h1 className="wiki-contrib__title">
            <span className="glitch" data-text="Wiki 贡献中心">
              Wiki 贡献中心
            </span>
          </h1>
          <p className="wiki-contrib__desc">
            绑定 jAccount 与 GitHub 后，可查看你在 SJTU Wiki 等条目体系下累计的贡献分数。
            jAccount / 学工号 / GitHub 名义下的贡献会自动归并到同一账号。
          </p>
        </div>
      </section>

      <section className="section wiki-contrib__body-section">
        <div className="container wiki-contrib__container">
          {oauthError && (
            <div className="wiki-banner wiki-banner--error" role="alert">
              <span className="wiki-banner__label">// oauth error</span>
              <span className="wiki-banner__msg">{oauthError}</span>
              <button
                type="button"
                className="wiki-banner__close"
                onClick={() => setOauthError(null)}
                aria-label="关闭"
              >
                ×
              </button>
            </div>
          )}

          {phase.kind === 'loading' && <LoadingBlock />}
          {phase.kind === 'error' && <ErrorBlock message={phase.message} />}
          {phase.kind === 'ready' && (
            <ReadyView me={phase.me} wiki={phase.wiki} />
          )}
        </div>
      </section>
    </div>
  );
}

/* ============ states ============ */

function LoadingBlock() {
  return (
    <div className="wiki-card corner wiki-card--center">
      <div className="wiki-loader" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <p className="wiki-card__note">
        // connecting · resolving jaccount session…
      </p>
    </div>
  );
}

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="wiki-card corner">
      <span className="wiki-card__label" style={{ color: 'var(--color-red)' }}>
        // error
      </span>
      <h2 className="wiki-card__title">出错了</h2>
      <p className="wiki-card__note">{message}</p>
      <button
        type="button"
        className="wiki-btn wiki-btn--primary"
        onClick={() => window.location.reload()}
      >
        重试
      </button>
    </div>
  );
}

/* ============ ready ============ */

function ReadyView({ me, wiki }: { me: Me; wiki: WikiData }) {
  const hasGithub = Boolean(me.github_username);
  return (
    <div className="wiki-stack">
      {/* —— 用户信息 —— */}
      <article className="wiki-card corner">
        <header className="wiki-card__head">
          <div>
            <span className="wiki-card__label">// signed in</span>
            <h2 className="wiki-card__title">
              你好，<span className="accent">{me.display_name || me.sjtu_account}</span>
            </h2>
            <p className="wiki-card__note">SJTU Geek 用户中心</p>
          </div>
          <a className="wiki-btn wiki-btn--ghost" href={logoutUrl}>
            退出登录 ↗
          </a>
        </header>

        <dl className="wiki-grid">
          <dt>jAccount</dt>
          <dd>{me.sjtu_account}</dd>
          <dt>姓名</dt>
          <dd>{me.real_name || '—'}</dd>
          <dt>身份</dt>
          <dd>{me.identity || '—'}</dd>
          <dt>学工号</dt>
          <dd>{me.student_number || '—'}</dd>
          <dt>学院</dt>
          <dd>{me.college || '—'}</dd>
        </dl>
      </article>

      {/* —— 绑定状态 —— */}
      <article className="wiki-card corner">
        <span className="wiki-card__label">// bindings</span>
        <h2 className="wiki-card__title">账号绑定</h2>

        <div className="wiki-bind">
          <div className="wiki-bind__main">
            <h3 className="wiki-bind__name">SJTU jAccount</h3>
            <p className="wiki-bind__sub">{me.sjtu_account}</p>
          </div>
          <span className="wiki-badge wiki-badge--ok">● 已绑定</span>
        </div>

        <div className="wiki-bind">
          <div className="wiki-bind__main">
            <h3 className="wiki-bind__name">GitHub</h3>
            {hasGithub ? (
              <p className="wiki-bind__sub">
                <a
                  href={
                    me.github_profile_url ||
                    `https://github.com/${me.github_username}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{me.github_username} ↗
                </a>
                {me.github_bound_at && (
                  <>
                    <span className="wiki-bind__meta-sep"> · </span>
                    <span className="wiki-bind__meta">
                      于 {formatDate(me.github_bound_at)} 绑定
                    </span>
                  </>
                )}
              </p>
            ) : (
              <p className="wiki-bind__sub">
                绑定后，Wiki 分数中以 GitHub 用户名记录的部分会自动并入你的账号。
              </p>
            )}
          </div>
          {hasGithub ? (
            <span className="wiki-badge wiki-badge--ok">● 已绑定</span>
          ) : (
            <a className="wiki-btn wiki-btn--primary" href={githubBindStartUrl}>
              绑定 GitHub
            </a>
          )}
        </div>
      </article>

      {/* —— 贡献分数 —— */}
      <article className="wiki-card corner">
        <header className="wiki-card__head">
          <div>
            <span className="wiki-card__label">// wiki score</span>
            <h2 className="wiki-card__title">Wiki 贡献分数</h2>
            <p className="wiki-card__note">
              汇总你 jAccount / 学工号 / GitHub 名义下的全部贡献
            </p>
          </div>
          <div className="wiki-score">
            <span className="wiki-score__num">{wiki.total_score}</span>
            <span className="wiki-score__unit">分</span>
          </div>
        </header>

        <p className="wiki-card__paragraph">
          Wiki 贡献分数用来记录和鼓励用户对 Wiki 及相关内容的贡献。你可以在{' '}
          <a
            href="https://share.dyweb.sjtu.cn/"
            target="_blank"
            rel="noopener noreferrer"
          >
            传承交大 ↗
          </a>{' '}
          兑换 Wiki 贡献分数。
        </p>

        <div className="wiki-detail">
          <h4 className="wiki-detail__title">// 分数明细</h4>
          <table className="wiki-table">
            <thead>
              <tr>
                <th className="col-date">日期</th>
                <th>条目</th>
                <th className="col-score">分数</th>
              </tr>
            </thead>
            <tbody>
              {wiki.contributions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="wiki-table__empty">
                    暂无贡献分数
                  </td>
                </tr>
              ) : (
                wiki.contributions.map((it, i) => (
                  <ContribRow key={`${it.date}-${it.entry}-${i}`} item={it} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}

function ContribRow({ item }: { item: ContribItem }) {
  return (
    <tr>
      <td className="col-date">{item.date ? formatDate(item.date) : '—'}</td>
      <td>{item.entry}</td>
      <td className="col-score">
        {item.score > 0 ? `+${item.score}` : item.score}
      </td>
    </tr>
  );
}

function formatDate(iso: string): string {
  // 支持 'YYYY-MM-DD' 和完整 ISO 时间戳两种来源
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}
