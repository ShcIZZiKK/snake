class Tile {
  context: CanvasRenderingContext2D;
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

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public draw(value: number, x: number, y: number) {
    if (!value) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.context.fillStyle = this.colors[value];
    const posX = (this.width * x) + (this.padding * x) + this.padding;
    const posY = (this.height * y) + (this.padding * y) + this.padding;
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
