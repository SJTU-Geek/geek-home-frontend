import { paramKey, type ApiParam, type ApiParamLocation, type ParamValues } from '../../api/openApi';

const LOCATION_SECTIONS: { location: ApiParamLocation; label: string }[] = [
  { location: 'path', label: '路径参数 · Path' },
  { location: 'query', label: '查询参数 · Query' },
  { location: 'header', label: '请求头 · Header' },
  { location: 'body', label: '请求体 · Body (application/json)' },
];

export const TYPE_LABEL: Record<string, string> = {
  string: 'string',
  integer: 'int',
  number: 'number',
  boolean: 'bool',
  enum: 'enum',
  array: 'array',
};

interface FieldProps {
  param: ApiParam;
  value: string;
  onChange: (key: string, value: string) => void;
}

function Field({ param, value, onChange }: FieldProps) {
  const key = paramKey(param);
  const numeric = param.type === 'integer' || param.type === 'number';
  const placeholder = param.example ? `例：${param.example}` : '';

  let control: JSX.Element;
  if (param.type === 'boolean') {
    control = (
      <select value={value} onChange={(e) => onChange(key, e.target.value)}>
        <option value="">（默认 {param.default || 'false'}）</option>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  } else if (param.type === 'enum' && param.enum && param.enum.length > 0) {
    control = (
      <select value={value} onChange={(e) => onChange(key, e.target.value)}>
        <option value="">（选择）</option>
        {param.enum.map((v) => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
    );
  } else {
    control = (
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        inputMode={numeric ? 'numeric' : undefined}
        spellCheck={false}
        onChange={(e) => onChange(key, e.target.value)}
      />
    );
  }

  return (
    <div className="api-form__row">
      <div className="api-form__docs">
        <span className="api-form__name">
          {param.name}
          {param.required && <i className="api-form__required">*</i>}
        </span>
        <span className="api-form__type">{TYPE_LABEL[param.type] || param.type}</span>
        {param.description && <span className="api-form__desc">{param.description}</span>}
        {(param.default || param.example) && (
          <span className="api-form__meta">
            {param.default ? `默认 ${param.default}` : ''}
            {param.default && param.example ? ' · ' : ''}
            {param.example ? `示例 ${param.example}` : ''}
          </span>
        )}
      </div>
      <div className="api-form__control">{control}</div>
    </div>
  );
}

interface ParamFormProps {
  params: ApiParam[];
  values: ParamValues;
  onChange: (key: string, value: string) => void;
}

/** 请求参数：一份渲染同时承担「文档」与「在线调试表单」两个职责 */
export default function ParamForm({ params, values, onChange }: ParamFormProps) {
  const sections = LOCATION_SECTIONS.map((s) => ({
    ...s,
    list: params.filter((p) => p.location === s.location),
  })).filter((s) => s.list.length > 0);

  if (sections.length === 0) {
    return <p className="api-form__empty">// 该接口无需请求参数</p>;
  }

  return (
    <div className="api-form">
      {sections.map((s) => (
        <div key={s.location} className="api-form__section">
          <h4 className="api-form__section-title">{s.label}</h4>
          {s.list.map((p) => (
            <Field
              key={paramKey(p)}
              param={p}
              value={values[paramKey(p)] ?? ''}
              onChange={onChange}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
