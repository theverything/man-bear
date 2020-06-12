import React from "react";
import "./styles.css";

import { Board } from "./Board";
import Engine from "./Engine";
const game = new Engine();
console.log(game);
window.game = game;

export default function App() {
  return (
    <div className="App">
      <Board layout={game.layout} />
    </div>
  );
}
