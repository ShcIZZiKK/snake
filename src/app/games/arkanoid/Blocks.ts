interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  lives: number;
  color: string;
}

class Blocks {
  context: CanvasRenderingContext2D;
  items: Array<Block> = [];
  width = 60;
  height = 16;
  indent = 10;
  columns = 6;
  rows = 3;
  offsetWindow = 15;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public draw() {
    this.items.forEach((item) => {
      if (item.lives < 1) {
        return;
      }

      this.context.fillStyle = item.color;

      this.context.fillRect(item.x, item.y, item.width, item.height);
    });
  }

  public create(level: number) {
    this.items = [];

    switch (level) {
      case 1:
        this.createFirstLevel();
        break;
      case 2:
        this.createSecondLevel();
        break;
      default:
        this.createFirstLevel();
        break;
    }
  }

  private createFirstLevel() {
    const color = 'red';
    this.rows = 3;

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this.items.push({
          x: (this.width + this.indent) * column + this.offsetWindow,
          y: (this.height + this.indent) * row + this.offsetWindow,
          width: this.width,
          height: this.height,
          color,
          lives: 1
        });
      }
    }
  }

  private createSecondLevel() {
    const colors = ['red', 'orange', 'yellow', 'gray']
    const missColumns = [1, 4];
    this.rows = 4;

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (missColumns.includes(column)) {
          continue;
        }

        this.items.push({
          x: (this.width + this.indent) * column + this.offsetWindow,
          y: (this.height + this.indent) * row + this.offsetWindow,
          width: this.width,
          height: this.height,
          color: colors[row],
          lives: row === 3 ? 3 : 1
        });
      }
    }
  }
}

export default Blocks;
