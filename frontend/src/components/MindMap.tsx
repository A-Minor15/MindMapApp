import ReactFlow, { Background, Controls } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';

const  initialNodes: Node[] = [
  {
    id: '1',
    position: { x: 250, y: 100 },
    data: { label: '中心テーマ' },
  },
  {
    id: '2',
    position: { x: 100, y: 250 },
    data: { label: 'アイデアA' },
  },
  {
    id: '3',
    position: { x: 400, y: 250 },
    data: { label: 'アイデアB' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

export default function MindMap() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}