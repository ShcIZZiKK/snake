interface Position {
  x: number;
  y: number;
}

class Tile {
  context: CanvasRenderingContext2D;
  id: number;
  newX = 0;
  newY = 0;
  x = 0;
  y = 0;
  speed = 0.4;
  width = 105;
  height = 105;
  padding = 4;
  colors = {
    2: '#a7d3fa',
    4: '#82c2fa',
    8: '#ffa500',
    16: '#ff8400',
    32: '#e36200',
    64: '#bf0000',
    128: '#e8dd4a',
    256: '#bf8104',
    512: '#ff009d',
    1024: '#fc0061',
    2048: '#fa0000'
  };
  isAnimated = false;

  constructor(context: CanvasRenderingContext2D, id: number, x: number, y: number) {
    this.context = context;
    this.id = id;
    this.x = x;
    this.y = y;
  }

  public changePosition(newPos: Position) {
    this.newX = newPos.x;
    this.newY = newPos.y;

    this.isAnimated = true;
  }

  public draw(value: number) {
    if (!value) {
      return;
    }

    if (this.isAnimated) {
      switch (true) {
        case this.x < this.newX:
          this.x += this.speed;

          if (this.x > this.newX) {
            this.x = this.newX;
          }

          break;
        case this.x > this.newX:
          this.x -= this.speed;

          if (this.x < this.newX) {
            this.x = this.newX;
          }
          break;
        case this.y < this.newY:
          this.y += this.speed;

          if (this.y > this.newY) {
            this.y = this.newY;
          }
          break;
        case this.y > this.newY:
          this.y -= this.speed;

          if (this.y < this.newY) {
            this.y = this.newY;
          }
          break;
        default:
          break;
      }

      if (this.x === this.newX && this.y === this.newY) {
        this.isAnimated = false;

        return;
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.context.fillStyle = this.colors[value];
    const posX = (this.width * this.x) + (this.padding * this.x) + this.padding;
    const posY = (this.height * this.y) + (this.padding * this.y) + this.padding;
    this.context.fillRect(posX, posY, this.width, this.height);
    this.context.fillStyle = 'white';
    this.context.textBaseline = "top";
    this.context.font = "52px Pixeboy";
    let left = 0;

    switch (true) {
      case value < 10:
        left = 40;
        break;
      case value < 100:
        left = 30;
        break;
      case value < 1000:
        left = 18;
        break;
      default:
        left = 6;
        break;
    }

    this.context.fillText(value.toString(), posX + left, posY + 15);
  }
}

export default Tile;
