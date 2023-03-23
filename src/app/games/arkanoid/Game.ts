import Platform from './Platform';
import Ball from './Ball';
import Blocks from './Blocks';
import Mediator from '../../helpers/Mediator';
import AudioManager from '../../managers/AudioManager';

const mediator = new Mediator();

class Game {
  audioManager: AudioManager;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  platform: Platform;
  ball: Ball;
  blocks: Blocks;
  isBallOnPlatform = true;
  gameOver = false;

  init() {
    this.initAudioManager();
    this.initElements();
    this.subscribes();
  }

  public start() {
    this.audioManager.musicPlay('ark');
    this.gameOver = false;
    requestAnimationFrame(this.render.bind(this));
  }

  private initAudioManager() {
    const musicList = [
      { name: 'ark', file: 'ark.mp3', loop: true },
      { name: 'food', file: 'food.mp3', loop: false },
      { name: 'lose', file: 'lose.mp3', loop: false }
    ];

    this.audioManager = new AudioManager();
    this.audioManager.addMusicList(musicList);
  }

  private render() {
    requestAnimationFrame(this.render.bind(this));

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.isBallOnPlatform) {
      this.ball.move();

      const nextYPositionBall = this.ball.y + this.ball.speed;
      const nextXPositionBall = this.ball.x + this.ball.speed;

      this.blocks.items.forEach((block) => {
        if (block.isAlive &&
          nextXPositionBall + this.ball.radius > block.x &&
          nextXPositionBall < block.x + block.width &&
          nextYPositionBall + this.ball.radius > block.y &&
          nextYPositionBall < block.y + block.height
        ) {
          this.audioManager.musicPlay('food');
          block.isAlive = false;
          this.ball.setDirectionY(1);
        }
      });

      if (nextXPositionBall + this.ball.radius > this.platform.x &&
        nextXPositionBall < this.platform.x + this.platform.width &&
        nextYPositionBall + this.ball.radius > this.platform.y &&
        nextYPositionBall < this.platform.y + this.platform.height
      ) {
        this.audioManager.musicPlay('food');
        this.ball.setDirectionY(-1);
        const xDir = this.ball.x > (this.platform.x + this.platform.width / 2) ? 1 : -1;

        console.log(xDir);

        this.ball.setDirectionX(xDir);
      }
    }

    this.platform.render();
    this.ball.render();
    this.blocks.render();
  }

  private initElements() {
    this.canvas = <HTMLCanvasElement>document.getElementById('game');
    this.context = this.canvas.getContext('2d');

    this.platform = new Platform();
    this.ball = new Ball();
    this.blocks = new Blocks();

    this.platform.init(this.context, this.canvas.width);
    this.ball.init(this.context);
    this.blocks.init(this.context);
  }

  private subscribes() {
    mediator.subscribe('keyboard:ArrowLeft', () => {
      this.platform.move(-1);

      if (this.isBallOnPlatform) {
        this.ball.followForPlatform(this.platform.x, this.platform.width);
      }
    });

    mediator.subscribe('keyboard:ArrowRight', () => {
      this.platform.move(1);

      if (this.isBallOnPlatform) {
        this.ball.followForPlatform(this.platform.x, this.platform.width);
      }
    });

    mediator.subscribe('keyboard:Space', () => {
      if (this.isBallOnPlatform) {
        this.isBallOnPlatform = false;
      }
    });
  }
}

export default Game;
