import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import './MindMapNode.css';

export default function MindMapNode({ id, data }: any) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(data.label);

  const finishEdit = () => {
    setEditing(false);
    data.onChange(id, value);
  }

  return (
    <div
      className="mindmap-node"
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          className="node-input"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={finishEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') finishEdit();
          }}
        />
      ) : (
        <span>{data.label}</span>
      )}

      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
};