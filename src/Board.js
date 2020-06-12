import React from "react";
import cx from "classnames";
import "./styles.css";

function Box({ t, r, b, l, c, p }) {
  return (
    <div
      className={cx("Box", {
        t,
        r,
        b,
        l
      })}
    >
      {c}
    </div>
  );
}

export function Board({ layout }) {
  return (
    <div className="Board">
      {layout
        .map((r, i) =>
          r.map((b, j) => <Box key={`${i}:${j}`} p={`${i}:${j}`} {...b} />)
        )
        .flat()}
    </div>
  );
}
