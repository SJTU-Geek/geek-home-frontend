import { type ApiParam, type ApiParamLocation } from '../../api/openApi';
import { TYPE_LABEL } from './ParamForm';

const LOCATION_SECTIONS: { location: ApiParamLocation; label: string }[] = [
  { location: 'path', label: '路径参数 · Path' },
  { location: 'query', label: '查询参数 · Query' },
  { location: 'header', label: '请求头 · Header' },
  { location: 'body', label: '请求体 · Body (application/json)' },
];

/** 请求参数文档表（只读，展示用；可交互的调试表单在 TryPanel 里） */
export default function ParamsTable({ params }: { params: ApiParam[] }) {
  if (!params || params.length === 0) {
    return <p className="api-form__empty">// 该接口无需请求参数</p>;
  }

  const sections = LOCATION_SECTIONS.map((s) => ({
    ...s,
    list: params.filter((p) => p.location === s.location),
  })).filter((s) => s.list.length > 0);

  return (
    <div className="api-params">
      {sections.map((s) => (
        <div key={s.location} className="api-params__section">
          <h4 className="api-form__section-title">{s.label}</h4>
          <table className="api-params__table">
            <thead>
              <tr>
                <th>名称</th>
                <th>类型</th>
                <th>必填</th>
                <th>默认</th>
                <th>示例</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              {s.list.map((p) => (
                <tr key={p.name}>
                  <td className="api-params__name">{p.name}</td>
                  <td>
                    <span className="api-form__type">{TYPE_LABEL[p.type] || p.type}</span>
                    {p.type === 'enum' && p.enum && p.enum.length > 0 && (
                      <span className="api-params__enum">{p.enum.join(' / ')}</span>
                    )}
                  </td>
                  <td>{p.required ? <span className="api-params__req">*</span> : '—'}</td>
                  <td className="api-params__mute">{p.default || '—'}</td>
                  <td className="api-params__mute">{p.example || '—'}</td>
                  <td className="api-params__desc">{p.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
