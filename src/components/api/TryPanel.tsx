import { useEffect, useState } from 'react';
import {
  buildRequest,
  coerceParam,
  loginNextUrl,
  paramKey,
  prettyJson,
  sendTryRequest,
  type ApiEndpoint,
  type ParamValues,
} from '../../api/openApi';
import ParamForm from './ParamForm';

type TryState =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'invalid'; errors: string[] }
  | { kind: 'done'; result: Awaited<ReturnType<typeof sendTryRequest>> };

interface TryPanelProps {
  endpoint: ApiEndpoint;
  values: ParamValues;
  authPhase: 'loading' | 'anon' | 'user';
  onClose: () => void;
  onChange: (key: string, value: string) => void;
}

/** 右侧在线调试浮窗：填写参数 → 发送 → 查看结果；需登录接口内嵌登录引导 */
export default function TryPanel({ endpoint, values, authPhase, onClose, onChange }: TryPanelProps) {
  const [tryState, setTryState] = useState<TryState>({ kind: 'idle' });

  // 切换端点后重置上一次的结果
  useEffect(() => {
    setTryState({ kind: 'idle' });
  }, [endpoint.slug]);

  const send = async () => {
    if (tryState.kind === 'sending') return;
    const errors: string[] = [];
    for (const p of endpoint.params) {
      const r = coerceParam(p, values[paramKey(p)] ?? '');
      if (r.error) errors.push(r.error);
    }
    if (errors.length > 0) {
      setTryState({ kind: 'invalid', errors });
      return;
    }
    setTryState({ kind: 'sending' });
    const req = buildRequest(endpoint, values);
    const result = await sendTryRequest(req);
    setTryState({ kind: 'done', result });
  };

  const loginCta =
    endpoint.auth === 'session' &&
    (authPhase === 'anon' || (tryState.kind === 'done' && tryState.result.status === 401));

  return (
    <aside className="api-panel" aria-label="在线调试浮窗">
      <header className="api-panel__head">
        <div>
          <span className="api-card__label">// try it</span>
          <h2 className="api-panel__title">在线调试</h2>
        </div>
        <button type="button" className="api-panel__close" onClick={onClose} aria-label="关闭调试面板">
          ×
        </button>
      </header>

      <div className="api-panel__target">
        <span className={`api-method api-method--${endpoint.method.toLowerCase()}`}>
          {endpoint.method}
        </span>
        <code>{endpoint.path}</code>
      </div>

      {loginCta && (
        <div className="api-login-cta">
          <div className="api-login-cta__main">
            <b>该接口需要 jAccount 登录</b>
            <span>
              {authPhase === 'anon'
                ? '登录后会跳回本页并保留当前选择，再发送请求即可。'
                : '请求返回 401，登录状态可能已过期，请重新登录后再试。'}
            </span>
          </div>
          <a
            className="api-btn api-btn--primary"
            href={loginNextUrl(endpoint.slug)}
          >
            前往登录 →
          </a>
        </div>
      )}

      <ParamForm params={endpoint.params} values={values} onChange={onChange} />

      {tryState.kind === 'invalid' && (
        <div className="api-try__errors" role="alert">
          {tryState.errors.map((e, i) => (
            <p key={i}>// {e}</p>
          ))}
        </div>
      )}

      <div className="api-try__bar">
        <button
          type="button"
          className="api-btn api-btn--primary"
          disabled={tryState.kind === 'sending'}
          onClick={send}
        >
          {tryState.kind === 'sending' ? '发送中…' : '发送请求'}
        </button>
      </div>

      {tryState.kind === 'done' && (
        <div className="api-try__result">
          <div className="api-try__meta">
            <span
              className={`api-status ${tryState.result.ok ? 'api-status--ok' : 'api-status--bad'}`}
            >
              {tryState.result.status || 'ERR'} {tryState.result.statusText}
            </span>
            <span className="api-try__time">{tryState.result.durationMs} ms</span>
          </div>
          <pre className="api-try__body">
            <code>{prettyJson(tryState.result.bodyText)}</code>
          </pre>
        </div>
      )}
    </aside>
  );
}
