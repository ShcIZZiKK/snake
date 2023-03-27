class Tile {
  context: CanvasRenderingContext2D;
  width = 40;
  height = 40;
  padding = 5;
  colors = {
    0: 'gray',
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.context.fillStyle = this.colors[value];
    const posX = (this.width * x) + (this.padding * x) + this.padding;
    const posY = (this.height * y) + (this.padding * y) + this.padding;
    this.context.fillRect(posX, posY, this.width, this.height);
    this.context.fillStyle = 'white';
    this.context.font = "12px serif";
    this.context.fillText(value.toString(), posX + 16, posY + 20);
  }
}

export default Tile;
