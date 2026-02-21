import React, { useState } from 'react';
import { P5Canvas } from './components/P5Canvas';
import { fishScene, snakeScene, lizardScene } from './scenes';
import type { SketchFn } from './components/P5Canvas';

interface Scene {
  id: string;
  name: string;
  sketch: SketchFn;
}

const scenes: Scene[] = [
  { id: 'fish', name: 'Fish', sketch: fishScene },
  { id: 'snake', name: 'Snake', sketch: snakeScene },
  { id: 'lizard', name: 'Lizard', sketch: lizardScene },
];

/**
 * Main App component with scene navigation sidebar
 */
export const App: React.FC = () => {
  const [currentSceneId, setCurrentSceneId] = useState<string>('fish');

  const currentScene = scenes.find(s => s.id === currentSceneId) || scenes[0];

  return (
    <div style={{ display: 'flex', height: '100vh', margin: 0, padding: 0 }}>
      {/* Sidebar Navigation */}
      <nav
        style={{
          width: '200px',
          backgroundColor: '#282c34',
          color: '#fff',
          padding: '20px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>
          Animal Proc Anim
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {scenes.map((scene) => (
            <li key={scene.id} style={{ marginBottom: '10px' }}>
              <button
                onClick={() => setCurrentSceneId(scene.id)}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  backgroundColor: currentSceneId === scene.id ? '#61dafb' : '#3a404d',
                  color: currentSceneId === scene.id ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (currentSceneId !== scene.id) {
                    e.currentTarget.style.backgroundColor = '#4a5060';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentSceneId !== scene.id) {
                    e.currentTarget.style.backgroundColor = '#3a404d';
                  }
                }}
              >
                {scene.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Canvas Container */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <P5Canvas sketch={currentScene.sketch} />
      </main>
    </div>
  );
};

export default App;
