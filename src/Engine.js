const antigonus = "🏃‍♀";
const bear = "🐻";

function cloneLayout(layout, antigonusPos, bearPos) {
  const clone = [];

  layout.forEach((r, y) => {
    const row = [];

    r.forEach((s, x) => {
      const block = { t: s.t, r: s.r, b: s.b, l: s.l };

      if (antigonusPos.x === x && antigonusPos.y === y) {
        block.c = antigonus;
      }

      if (bearPos.x === x && bearPos.y === y) {
        block.c = bear;
      }

      row.push(block);
    });

    clone.push(row);
  });

  return clone;
}

export default class Engine {
  constructor(layout, antigonusPos, bearPos, winPos) {
    this.layout = layout;
    this.antigonusPos = antigonusPos;
    this.bearPos = bearPos;
    this.winPos = winPos;
    this.prevBearPos = this.bearPos;
    this.prevAntigonusPos = this.antigonusPos;
    this.updateLayout();
  }

  updateLayout() {
    this.layout = cloneLayout(this.layout, this.antigonusPos, this.bearPos);
  }

  validMoves(charPos) {
    let moves = {
      N: false,
      S: false,
      E: false,
      W: false,
    };

    let tile = this.layout[charPos.y][charPos.x];
    console.log(`Checking tile at x:${charPos.x} y: ${charPos.y}`, tile);
    moves.N = tile.t === 0;
    moves.S = tile.b === 0;
    moves.E = tile.r === 0;
    moves.W = tile.l === 0;

    return moves;
  }

  //  y
  // t == N
  // b == S
  //  x
  // r == E
  // l == W
  bearMove() {
    let moves = this.validMoves(this.bearPos);
    console.log("Valid moves:", moves);
    let dx = this.bearPos.x - this.antigonusPos.x;
    let dy = this.bearPos.y - this.antigonusPos.y;
    let pos = { ...this.bearPos };

    if (dx < 0 && moves.E) {
      // column
      pos.x += 1;
    } else if (dx > 0 && moves.W) {
      // column
      pos.x -= 1;
    } else if (dy < 0 && moves.S) {
      // row
      pos.y += 1;
    } else if (dy > 0 && moves.N) {
      // row
      pos.y -= 1;
    } else {
      return false;
    }

    this.bearPos = pos;
    return true;
  }

  antigonusMove(direction) {
    console.log("Attempting move:", direction);

    if (
      direction === "N" ||
      direction === "S" ||
      direction === "E" ||
      direction === "W"
    ) {
      let moves = this.validMoves(this.antigonusPos);
      console.log("Valid moves:", moves);
      if (moves[direction]) {
        let pos = { ...this.antigonusPos };
        switch (direction) {
          case "N":
            pos.y -= 1;
            break;
          case "S":
            pos.y += 1;
            break;
          case "E":
            pos.x += 1;
            break;
          case "W":
            pos.x -= 1;
            break;
          default:
            // never?
            console.log("Howw");
            break;
        }

        console.log(this.antigonusPos, pos);
        this.antigonusPos = pos;
        return true;
      }
    }

    return false;
  }

  findWinner() {
    let winner = {
      antigonus: false,
      bear: false,
    };
    // if bear position == Antigonus postion
    //  bear wins
    winner.bear = this.comparePos(this.antigonusPos, this.bearPos);
    // if Antigonus position = 3,3
    //  Antigonus wins
    winner.antigonus = this.comparePos(this.antigonusPos, this.winPos);

    return winner;
  }

  comparePos(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  step(direction) {
    this.prevBearPos = this.bearPos;
    this.prevAntigonusPos = this.antigonusPos;

    let bearMoved = false;

    let antigonusMoved = this.antigonusMove(direction.toUpperCase());

    if (antigonusMoved) {
      bearMoved = this.bearMove();
    }

    let winner = this.findWinner();
    this.updateLayout();

    return {
      antigonusMoved,
      bearMoved,
      winner,
      layout: this.layout,
    };
  }
}
