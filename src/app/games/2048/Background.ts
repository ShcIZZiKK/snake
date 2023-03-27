class Background {
  context: CanvasRenderingContext2D;
  width = 105;
  height = 105;
  padding = 4;
  size = 4;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public draw() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.context.fillStyle = '#abaeb2';
        const posX = (this.width * x) + (this.padding * x) + this.padding;
        const posY = (this.height * y) + (this.padding * y) + this.padding;
        this.context.fillRect(posX, posY, this.width, this.height);
      }
    }
  }
}

export default Background;
