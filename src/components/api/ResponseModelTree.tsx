import type { ApiResponseModelNode } from '../../api/openApi';

interface NodeProps {
  node: ApiResponseModelNode;
}

function TreeNode({ node }: NodeProps) {
  return (
    <div className="api-tree__node">
      <div className="api-tree__row">
        <span className="api-tree__name">{node.name}</span>
        <span className="api-tree__type">{node.type}</span>
        {node.description && <span className="api-tree__desc">{node.description}</span>}
      </div>
      {node.children && node.children.length > 0 && (
        <div className="api-tree__children">
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

/** 响应模型树：name + type 徽章 + 说明，children 缩进嵌套 */
export default function ResponseModelTree({ nodes }: { nodes: ApiResponseModelNode[] }) {
  if (!nodes || nodes.length === 0) {
    return <p className="api-form__empty">// 暂无响应模型</p>;
  }
  return (
    <div className="api-tree">
      {nodes.map((node, i) => (
        <TreeNode key={i} node={node} />
      ))}
    </div>
  );
}
