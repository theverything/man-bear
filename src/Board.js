import React, { useLayoutEffect } from "react";
import cx from "classnames";
import "./styles.css";

function Box({ t, r, b, l, c }) {
  return (
    <div
      className={cx("Box", {
        t,
        r,
        b,
        l,
      })}
    >
      {c}
    </div>
  );
}

export function Board({ layout, width, height }) {
  useLayoutEffect(() => {
    window.root.style.setProperty("--grid-rows", `${width}`);
    window.root.style.setProperty("--grid-cols", `${height}`);
  }, [width, height]);

  return (
    <div className="Board">
      {layout
        .map((r, i) => r.map((b, j) => <Box key={`${i}:${j}`} {...b} />))
        .flat()}
    </div>
  );
}
