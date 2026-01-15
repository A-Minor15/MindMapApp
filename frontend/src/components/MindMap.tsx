import {useCallback, useEffect, useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import MindMapNode from './MindMapNode';
import 'reactflow/dist/style.css';
import './MindMap.css';

// カスタムノードの種類を登録
// ここでは、'mindmap'がMindMapNodeコンポーネントに対応
const nodeTypes = {
  mindmap: MindMapNode,
}

export default function MindMap() {
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
        },
      };
      return [...nds, newNode];
    });
    setEdges((eds) => [...eds, { id: `${parentId}-${newId}`, source: parentId, target: newId }]);
  }

  // nodes / edges の state
  // 初期ノードは中心テーマを表す簡単な例
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      type: 'mindmap',
      position: { x: 250, y: 100 },
      data: {
        label: '中心テーマ',
        onChange: updateNodeLabel, // ノード内からラベル更新を呼べるように渡す
        onAddChild: addChildNode,
      },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  // 初回マウント時にサーバーからマインドマップを取得してstateにセットする
  // backendがhttp://localhost:3000/mindmapを提供している前提
  useEffect(() => {
    fetch('http://localhost:3000/mindmap')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          // サーバーから来たノードにも操作用コールバックを注入する
          const injectedNodes = (data.nodes || []).map((n: any) => ({
            ...n,
            data: { ...(n.data || {}), onChange: updateNodeLabel, onAddChild: addChildNode }
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
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};