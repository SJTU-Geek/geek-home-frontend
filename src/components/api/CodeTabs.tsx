import { useMemo, useState } from 'react';
import { generateSnippets, SNIPPET_LANGS } from '../../api/codegen';
import type { ApiEndpoint, ParamValues } from '../../api/openApi';

/** 剪贴板写入：clipboard API 优先，失败降级 execCommand */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

interface CodeTabsProps {
  endpoint: ApiEndpoint;
  values: ParamValues;
}

/** 代码生成：7 种语言 tab + 一键复制，随表单值实时反映参数 */
export default function CodeTabs({ endpoint, values }: CodeTabsProps) {
  const [lang, setLang] = useState(SNIPPET_LANGS[0].id);
  const [copied, setCopied] = useState(false);

  const snippets = useMemo(
    () => generateSnippets(endpoint, values),
    [endpoint, values],
  );
  const code = snippets[lang] ?? '';

  const onCopy = async () => {
    if (await copyToClipboard(code)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <div className="api-code">
      <div className="api-code__tabs" role="tablist" aria-label="代码格式">
        {SNIPPET_LANGS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="tab"
            aria-selected={lang === l.id}
            className={`api-code__tab ${lang === l.id ? 'is-active' : ''}`}
            onClick={() => setLang(l.id)}
          >
            {l.label}
          </button>
        ))}
        <button type="button" className="api-code__copy" onClick={onCopy}>
          [{copied ? '已复制 ✓' : '复制'}]
        </button>
      </div>
      <pre className="api-code__pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
