import {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import MindMapNode from './MindMapNode';
import 'reactflow/dist/style.css';
import './MindMap.css';

// .envファイルからAPI取得
const API_BASE = import.meta.env.VITE_API_BASE;

// カスタムノードの種類を登録
// 'mindmap'がMindMapNodeコンポーネントに対応
const nodeTypes = {
  mindmap: MindMapNode,
}

export default function MindMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // ノードのラベルを更新するヘルパー関数
  // idに一致するノードのdata.labelを差し替える
  const updateNodeLabel = (id: string, label: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
        ? { ...node, data: { ...node.data, label } }
        : node
      )
    );
  };

  // 親ノードから接続された新規ノードを追加する関数
  // 親ノードの位置を参照して右側に配置し、親と接続する
  function addChildNode(parentId: string) {
    const newId = Date.now().toString();

    setNodes((nds) => {
      const parent = nds.find(n => n.id === parentId);
      const pos = parent
        ? { x: parent.position.x + 150, y: parent.position.y + 0 }
        : { x: Math.random() * 400, y: Math.random() * 400 }
      const newNode: Node = {
        id: newId,
        type: 'mindmap',
        position: pos,
        data: {
          label: '', // 新規は空ラベル（ユーザーが編集）
          onChange: updateNodeLabel,
          onAddChild: addChildNode,
          onDelete: deleteNode,
        },
      };
      return [...nds, newNode];
    });
    setEdges((eds) => [...eds, { id: `${parentId}-${newId}`, source: parentId, target: newId }]);
  }

  // ラベルを削除する関数
  const deleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  // 初回マウント時にサーバーからマインドマップを取得してstateにセットする
  useEffect(() => {
    fetch(`${API_BASE}/mindmap`)
      .then(async (res) => {
        const text = await res.text();

        // 何も保存されていない初回起動時
        if (!text) {
          return null;
        }

        return JSON.parse(text);
      })
      .then((data) => {
        if (data) {
          // サーバーから来たノードにも操作用コールバックを注入する
          const injectedNodes = (data.nodes || []).map((n: any) => ({
            ...n,
            data: {
              ...(n.data || {}),
              onChange: updateNodeLabel,
              onAddChild: addChildNode,
              onDelete: deleteNode,
            }
          }));
          setNodes(injectedNodes);
          setEdges(data.edges || []);
        }
      });
  }, []);

  // ノード同士を接続したときにエッジを追加するコールバック
  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    []
  );

  // 新しいノードをランダム位置に追加する
  const addNode = () => {
    const newNode: Node = {
      id: Date.now().toString(), // 簡易ID（本番では別の戦略を検討）
      type: 'mindmap',
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: '新しいノード',
        onChange: updateNodeLabel,
        onAddChild: addChildNode,
        onDelete: deleteNode,
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  // 現在のnodes/edgesをバックエンドに保存する（POST）
  const saveMindMap = async() => {
    await fetch('http://localhost:3000/mindmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, edges }),
    });
  };

  // JSX: ボタンとReact Flowの描画
  // React Flowコンポーネントにnodes/edgesとonConnect, nodeTypesを渡す
  return (
    <div className="mindmap-container">
      <button className="add-button" onClick={addNode}>
        + ノード追加
      </button>
      <button className="add-button" onClick={saveMindMap}>
        💾 保存
      </button>

      <div className="flow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};