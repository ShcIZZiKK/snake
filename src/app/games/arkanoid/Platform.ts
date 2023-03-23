class Platform {
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  x = 175;
  y = 409;
  speed = 20;
  width = 90;
  height = 16;

  public init(context: CanvasRenderingContext2D, width: number) {
    this.context = context;
    this.canvasWidth = width;
  }

  public render() {
    this.context.fillStyle = 'blue';
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  public move(direction: number) {
    if (this.isOutside(direction)) {
      return;
    }

    console.log(this.x);

    this.x += this.speed * direction;
  }

  private isOutside(direction: number) {
    if (direction > 0 && this.x + this.width >= this.canvasWidth) {
      return true;
    } else if (direction < 0 && this.x <= 0) {
      return true;
    }

    return false;
  }
}

export default Platform;
