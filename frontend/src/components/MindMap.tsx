import {useCallback, useState} from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import MindMapNode from './MindMapNode';
import 'reactflow/dist/style.css';
import './MindMap.css';

const nodeTypes = {
  mindmap: MindMapNode,
}

export default function MindMap() {
  const updateNodeLabel = (id: string, label: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
        ? { ...node, data: { ...node.data, label } }
        : node
      )
    );
  };

  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      type: 'mindmap',
      position: { x: 250, y: 100 },
      data: {
        label: '中心テーマ',
        onChange: updateNodeLabel,
      },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const addNode = () => {
    const newNode: Node = {
      id: Date.now().toString(),
      type: 'mindmap',
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
      data: {
        label: '新しいノード',
        onChange: updateNodeLabel
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="mindmap-container">
      <button className="add-button" onClick={addNode}>
        + ノード追加
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