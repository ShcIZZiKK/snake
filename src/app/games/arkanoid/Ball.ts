import Platform from './Platform';
import Game from './Game';

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  lives: number;
  color: string;
}

class Ball {
  game: Game;
  context: CanvasRenderingContext2D;
  x = 220;
  y = 399;
  radius = 10;
  velocityX = 1; // ускорение по оси x
  velocityY = 2; // ускорение по оси y
  dx = 0; // текущая скорость по x
  dy = 0; // текущая скорость по y

  constructor(context: CanvasRenderingContext2D, game: Game) {
    this.context = context;
    this.game = game;
  }

  public setDefaultValues() {
    this.x = 220;
    this.y = 399;
    this.velocityX = 1;
    this.velocityY = 2;
    this.dx = 0;
    this.dy = 0;
  }

  public draw() {
    this.context.fillStyle = 'green';
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
  }

  public checkCollision(element: Block | Platform) {
    const { x, y } = this.getNextPosition();

    return x < element.x + element.width &&
      x + this.radius > element.x &&
      y < element.y + element.height &&
      y + this.radius > element.y;
  }

  public setDirectionX(direction: number) {
    this.dx = this.velocityX * direction;
  }

  public setDirectionY(direction: number) {
    this.dy = this.velocityY * direction;
  }

  public revertDirectionY() {
    this.dy = -this.dy;
  }

  public checkVelocityX(platform: Platform) {
    const segmentSize = platform.width / 8;
    const segmentSizeX2 = segmentSize * 2;
    const segmentSizeX3 = segmentSize * 3;
    const segmentSizeX4 = segmentSize * 4;
    const centerPlatform = platform.x + platform.width / 2;
    const direction = this.x > centerPlatform ? 1 : -1;

    const position = direction > 0 ? this.x - centerPlatform : centerPlatform - this.x;

    if (position <= segmentSize) {
      this.velocityX = 1;
    } else if (position > segmentSize && position <= segmentSizeX2) {
      this.velocityX = 2;
    } else if (position > segmentSizeX2 && position <= segmentSizeX3) {
      this.velocityX = 3;
    } else if (position > segmentSizeX3 && position <= segmentSizeX4) {
      this.velocityX = 4;
    }

    this.setDirectionX(direction);
  }

  public move() {
    this.checkOutside();

    this.x += this.dx;
    this.y += this.dy;
  }

  public followForPlatform(platformX: number, platformWidth: number) {
    this.x = platformX + (platformWidth / 2);
  }

  private checkOutside() {
    const { x, y } = this.getNextPosition();

    if (x < 0) {
      this.setDirectionX(1);
    } else if (x + this.radius > 440) {
      this.setDirectionX(-1);
    }

    if (y < 0) {
      this.setDirectionY(1);
    } else if (y + this.radius > 440) {
      this.game.loseGame();
    }
  }

  private getNextPosition() {
    return {
      x: this.x + this.dx,
      y: this.y + this.dy
    }
  }
}

export default Ball;
