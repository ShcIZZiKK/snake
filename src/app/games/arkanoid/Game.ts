import Platform from './Platform';
import Ball from './Ball';
import Blocks from './Blocks';
import AudioManager from '../../managers/AudioManager';
import StoreManager from '../../managers/StoreManager';
import Mediator from '../../helpers/Mediator';
import DefaultGame from '../../abstracts/DefaultGame';

const mediator = Mediator.getInstance();

class Game extends DefaultGame {
  audioManager: AudioManager;
  storeManager: StoreManager;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  platform: Platform;
  ball: Ball;
  blocks: Blocks;
  isBallOnPlatform = true;
  gameOver = false;
  currentLevel = 1;
  allLevelCount = 2;
  score = 0;

  init() {
    this.initManagers();
    this.initElements();
    this.bindEvents();
    this.start();
  }

  start() {
    this.setGameObjectsPositions();
    this.audioManager.musicPlay('ark');
    this.gameOver = false;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    requestAnimationFrame(this.update.bind(this));
  }

  restart() {
    this.start();
  }

  loseGame() {
    this.audioManager.musicStop('ark');
    this.audioManager.musicPlay('lose');
    this.gameOver = true;

    mediator.publish('game:lose', this.score);

    this.score = 0;
    this.storeManager.updateCurrentValue(this.score);
  }

  winGame() {
    this.audioManager.musicStop('ark');
    this.audioManager.musicPlay('win');
    this.gameOver = true;

    mediator.publish('game:win', this.score);

    this.score = 0;
    this.storeManager.updateCurrentValue(this.score);
  }

  update() {
    if (this.gameOver) {
      return;
    }

    requestAnimationFrame(this.update.bind(this));

    if (this.isBallOnPlatform) {
      this.ball.followForPlatform(this.platform.x, this.platform.width);
    } else {
      this.ball.move();
      this.checkCollisionBlocks();
      this.checkCollisionPlatform();
    }

    this.draw();
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.platform.draw();
    this.ball.draw();
    this.blocks.draw();
  }

  private setGameObjectsPositions() {
    this.isBallOnPlatform = true;
    this.currentLevel = 1;
    this.blocks.create(this.currentLevel);
    this.platform.setDefaultValues();
    this.ball.setDefaultValues();
  }

  private checkCollisionBlocks() {
    this.blocks.items.forEach((block) => {
      if (block.lives < 1) {
        return;
      }

      if (!this.ball.checkCollision(block)) {
        return;
      }

      this.audioManager.musicPlay('food');
      this.ball.revertDirectionY();

      block.lives--;

      if (block.lives <= 0) {
        this.score++;
        this.storeManager.updateCurrentValue(this.score);
        this.checkWin();
      }
    });
  }

  private checkCollisionPlatform() {
    if (!this.ball.checkCollision(this.platform)) {
      return;
    }

    this.audioManager.musicPlay('food');

    this.ball.setDirectionY(-1);
    this.ball.checkVelocityX(this.platform);
  }

  private checkWin() {
    const aliveBlock = this.blocks.items.filter((item) => item.lives > 0);

    if (aliveBlock.length) {
      return;
    }

    this.nextLevel();
  }

  private nextLevel() {
    if (this.currentLevel >= this.allLevelCount) {
      this.winGame();

      return;
    }

    this.currentLevel++;
    this.isBallOnPlatform = true;
    this.blocks.create(this.currentLevel);
    this.platform.setDefaultValues();
    this.ball.setDefaultValues();
  }

  private initManagers() {
    const musicList = [
      { name: 'ark', file: 'ark.mp3', loop: true },
      { name: 'food', file: 'food.mp3', loop: false },
      { name: 'lose', file: 'lose.mp3', loop: false },
      { name: 'win', file: 'win.mp3', loop: false }
    ];

    this.audioManager = new AudioManager();
    this.audioManager.addMusicList(musicList);

    this.storeManager = new StoreManager('arkanoid');
  }

  private initElements() {
    this.canvas = <HTMLCanvasElement>document.getElementById('game');
    this.context = this.canvas.getContext('2d');

    this.platform = new Platform(this.context, this.canvas.width);
    this.ball = new Ball(this.context, this);
    this.blocks = new Blocks(this.context);
  }

  private bindEvents() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.audioManager.musicStop('ark');
        this.gameOver = true;

        mediator.publish('game:exit');

        return;
      }

      switch (event.code) {
        case 'ArrowLeft':
          this.platform.changeDirection(-1);

          break;
        case 'ArrowRight':
          this.platform.changeDirection(1);

          break;
        case 'Space':
          if (!this.isBallOnPlatform) {
            return;
          }

          this.isBallOnPlatform = false;
          this.ball.setDirectionY(-1);
          this.ball.setDirectionX(-1);

          break;
        default:
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
        this.platform.changeDirection(0);
      }
    });
  }
}

export default Game;
