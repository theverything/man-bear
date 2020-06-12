import React, { useRef, useState, useCallback, useEffect } from "react";
import "./styles.css";

import { Board } from "./Board";
import Engine from "./Engine";
import confetti from "./confetti";

const UP = 38;
const DOWN = 40;
const LEFT = 37;
const RIGHT = 39;
const ESCAPE = 27;

function useEngine() {
  const engine = useRef();

  if (!engine.current) {
    engine.current = new Engine();
  }

  const [state, setState] = useState({
    layout: engine.current.layout,
    winner: {},
  });

  const reset = useCallback(() => {
    engine.current = new Engine();
    setState({ layout: engine.current.layout, winner: {} });
  }, []);

  const move = useCallback((dir) => {
    const { winner, layout: nextLayout } = engine.current.step(dir);

    setState({ layout: nextLayout, winner });
  }, []);

  return [state, move, reset];
}

export default function App() {
  const [winner, setWinner] = useState("");
  const [state, move, reset] = useEngine();

  const keyDown = useCallback(
    (evt) => {
      evt.preventDefault();
      evt.stopPropagation();

      switch (evt.keyCode) {
        case UP:
          move("N");
          break;
        case DOWN:
          move("S");
          break;
        case LEFT:
          move("W");
          break;
        case RIGHT:
          move("E");
          break;
        case ESCAPE:
          reset();
          break;
        default:
          break;
      }
    },
    [move, reset]
  );

  useEffect(() => {
    let t = null;

    if (state.winner.bear) {
      setWinner("Bear");
      t = setTimeout(() => {
        reset();
      }, 1000);
    } else if (state.winner.antigonus) {
      setWinner("Antigonus");
      confetti.start(1000);
      t = setTimeout(() => {
        reset();
      }, 1000);
    } else {
      setWinner("");
    }

    return () => {
      clearTimeout(t);
    };
  }, [state.winner, reset]);

  useEffect(() => {
    document.addEventListener("keydown", keyDown);

    return () => {
      document.removeEventListener("keydown", keyDown);
    };
  }, [keyDown]);

  return (
    <div className="App">
      <h1>{winner !== "" ? `The ${winner} wins!!` : "Who will win?"}</h1>
      <Board layout={state.layout} />
    </div>
  );
}
