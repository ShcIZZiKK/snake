class Ball {
  context: CanvasRenderingContext2D;
  x = 220;
  y = 399;
  radius = 10;
  speed = 2;
  directionX = 0;
  directionY = -1;

  public init(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public render() {
    this.context.fillStyle = 'green';
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.fill();
  }

  public setDirectionX(direction: number) {
    this.directionX = direction;
  }

  public setDirectionY(direction: number) {
    this.directionY = direction;
  }

  public move() {
    const nextX = this.x + (this.speed * this.directionX);
    const nextY = this.y + (this.speed * this.directionY);

    if (nextX < 0) {
      this.setDirectionX(1);
    } else if (nextX + this.radius > 440) {
      this.setDirectionX(-1);
    }

    if (nextY < 0) {
      this.setDirectionY(1);
    } else if (nextY + this.radius > 440) {
      // this.setDirectionX(-1);
    }

    if (this.directionX) {
      this.x += this.speed * this.directionX;
    }

    if (this.directionY) {
      this.y += this.speed * this.directionY;
    }
  }

  public followForPlatform(platformX: number, platformWidth: number) {
    this.x = platformX + (platformWidth / 2);
  }
}

export default Ball;
