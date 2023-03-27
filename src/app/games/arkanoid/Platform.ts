class Platform {
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  x = 175;
  y = 409;
  maxSpeed = 6;
  dx = 0;
  width = 90;
  height = 16;

  constructor(context: CanvasRenderingContext2D, width: number) {
    this.context = context;
    this.canvasWidth = width;
  }

  public setDefaultValues() {
    this.x = 175;
    this.y = 409;
  }

  public draw() {
    this.update();

    this.context.fillStyle = 'blue';
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  public update() {
    if (this.isOutside()) {
      return;
    }

    this.x += this.dx;
  }

  public changeDirection(direction: number) {
    this.dx = this.maxSpeed * direction;
  }

  private isOutside() {
    const rightOutside = this.dx > 0 && this.x + this.width >= this.canvasWidth;
    const leftOutside = this.dx < 0 && this.x <= 0;

    return rightOutside || leftOutside;
  }
}

export default Platform;
