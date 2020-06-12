export default class Engine {
  constructor() {
    this.layout = [
      [
        { t: 1, r: 0, b: 1, l: 1 },
        { t: 1, r: 0, b: 0, l: 0 },
        { t: 1, r: 1, b: 0, l: 0 },
        { t: 1, r: 1, b: 0, l: 1 }
      ],
      [
        { t: 1, r: 0, b: 1, l: 1 },
        { t: 0, r: 0, b: 0, l: 0 },
        { t: 0, r: 0, b: 0, l: 0 },
        { t: 0, r: 1, b: 1, l: 0 }
      ],
      [
        { t: 1, r: 0, b: 0, l: 1 },
        { t: 0, r: 0, b: 0, l: 0 },
        { t: 0, r: 0, b: 0, l: 1 },
        { t: 1, r: 1, b: 0, l: 0 }
      ],
      [
        { t: 0, r: 0, b: 1, l: 1 },
        { t: 0, r: 0, b: 1, l: 0 },
        { t: 0, r: 1, b: 1, l: 0 },
        { t: 0, r: 0, b: 1, l: 1 }
      ]
    ];

    this.board = [[0, 0, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 0]];
    this.playerPos = { x: 2, y: 0 };
    this.bearPos = { x: 1, y: 3 };
    this.prevBearPos = this.bearPos;
    this.prevPlayerPos = this.playerPos;
    this.updateLayout();
  }

  updateLayout() {
    const player = "🏃‍♀";
    const bear = "🐻";
    let tempLayout = this.layout;

    delete tempLayout[this.prevPlayerPos.y][this.prevPlayerPos.x].c;
    delete tempLayout[this.prevBearPos.y][this.prevBearPos.x].c;

    tempLayout[this.playerPos.y][this.playerPos.x].c = player;
    tempLayout[this.bearPos.y][this.bearPos.x].c = bear;

    this.layout = tempLayout;
  }

  validMoves(charPos) {
    let moves = {
      N: false,
      S: false,
      E: false,
      W: false
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
    let dx = this.bearPos.x - this.playerPos.x;
    let dy = this.bearPos.y - this.playerPos.y;
    let pos = this.bearPos;

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

  playerMove(direction) {
    console.log("Attempting move:", direction);

    if (
      direction === "N" ||
      direction === "S" ||
      direction === "E" ||
      direction === "W"
    ) {
      let moves = this.validMoves(this.playerPos);
      console.log("Valid moves:", moves);
      if (moves[direction]) {
        let pos = this.playerPos;
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

        console.log(this.playerPos, pos);
        this.playerPos = pos;
        return true;
      }
    }

    return false;
  }

  findWinner() {
    let winner = {
      player: false,
      bear: false
    };
    // if bear position == player postion
    //  bear wins
    winner.bear = this.comparePos(this.playerPos, this.bearPos);
    // if player position = 3,3
    //  player wins
    winner.player = this.comparePos(this.playerPos, { x: 3, y: 3 });

    return winner;
  }

  comparePos(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  step(direction) {
    this.prevBearPos = this.bearPos;
    this.prevPlayerPos = this.playerPos;

    let playerMoved = this.playerMove(direction);
    let bearMoved = this.bearMove();
    let winner = this.findWinner();
    this.updateLayout();

    return {
      playerMoved,
      bearMoved,
      winner
    };
  }
}
