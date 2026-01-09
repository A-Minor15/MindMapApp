import MindMap from './components/MindMap';
import './index.css';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        MindMap App
      </header>

      <main className="main">
        <MindMap />
      </main>
    </div>
  );
}