import React, { useRef, useState, useCallback } from "react";
import "./styles.css";

import { Board } from "./Board";
import Engine from "./Engine";

function useEngine() {
  const engine = useRef();

  if (!engine.current) {
    engine.current = new Engine();
  }

  const [layout, setLayout] = useState(engine.current.layout);

  const move = useCallback((dir) => {
    const {
      antigonusMoved,
      bearMoved,
      winner,
      layout: nextLayout,
    } = engine.current.step(dir);

    setLayout(nextLayout);
  }, []);

  return [layout, move];
}

export default function App() {
  const [dir, setDir] = useState("");
  const [layout, move] = useEngine();

  return (
    <div className="App">
      <input
        type="text"
        value={dir}
        onChange={(evt) => setDir(evt.target.value)}
      />
      <button
        onClick={() => {
          move(dir);
          setDir("");
        }}
      >
        Move
      </button>
      <Board layout={layout} move={move} />
    </div>
  );
}
