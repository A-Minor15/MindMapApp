import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import './MindMapNode.css';

// シンプルなカスタムノードコンポーネント
// props: {id, data}を受け取り、data.labelを表示・編集できる
export default function MindMapNode({ id, data }: any) {
  // 編集モードかどうかのフラグ
  const [editing, setEditing] = useState(false);
  // 入力中のテキスト（ラベル）
  const [value, setValue] = useState(data.label);

  // 編集を終える処理
  // 編集状態を解除して、親コンポーネントへラベル更新を伝える
  const finishEdit = () => {
    setEditing(false);
    data.onChange(id, value);
  }

  return (
    <div
      className="mindmap-node"
      // ダブルクリックで編集モードに入る
      onDoubleClick={() => setEditing(true)}
    >
      {editing ? (
        // 編集中はinputを表示
        <input
          className="node-input"
          value={value}
          autoFocus
          // 入力をstateに反映
          onChange={(e) => setValue(e.target.value)}
          // フォーカスが外れたら編集確定
          onBlur={finishEdit}
          // Enterキーで編集確定
          onKeyDown={(e) => {
            if (e.key === 'Enter') finishEdit();
          }}
        />
      ) : (
        // 通常時はラベルと「＋」ボタンを表示
        <div className="node-label-with-add">
          <span>{data.label}</span>
          {/* ラベルの周りに配置する + ボタン */}
          {/* クリックで親ノードに接続された新規ノードを追加する */}
          <button
            className="add-child-button"
            onClick={(e) => {
              e.stopPropagation(); // ノード選択やドラッグと干渉しないようにする
              if (data.onAddChild) data.onAddChild(id);
            }}
            aria-label="Add child node"
          >
            +
          </button>
        </div>
      )}

      {/* React Flowの接続ハンドル */}
      {/* source: 左、target: 右に配置 */}
      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
    </div>
  );
};