interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  isAlive: boolean
}

class Blocks {
  context: CanvasRenderingContext2D;
  items: Array<Block> = [];
  width = 60;
  height = 16;
  indent = 10;
  columns = 6;
  rows = 3;

  public init(context: CanvasRenderingContext2D) {
    this.context = context;

    this.create();
  }

  public render() {
    this.context.fillStyle = 'red';

    this.items.forEach((item) => {
      if (!item.isAlive) {
        return;
      }

      this.context.fillRect(item.x, item.y, item.width, item.height);
    });
  }

  private create() {
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this.items.push({
          x: (this.width + this.indent) * column + 15,
          y: (this.height + this.indent) * row + 15,
          width: this.width,
          height: this.height,
          isAlive: true
        })
      }
    }
  }
}

export default Blocks;
