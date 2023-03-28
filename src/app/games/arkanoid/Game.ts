// Managers
import DefaultGame from '../../abstracts/DefaultGame';
import Mediator from '../../helpers/Mediator';

// Game elements
import Platform from './Platform';
import Ball from './Ball';
import Blocks from './Blocks';

// Custom
const mediator = Mediator.getInstance();

class Game extends DefaultGame {
  platform: Platform; // Экземпляр платформы
  ball: Ball; // Экземпляр мяча
  blocks: Blocks; // Экземпляр блоков

  isBallOnPlatform = true; // Флаг, что мяч должен двигаться вместе с платформой
  currentLevel = 1; // Текущий уровень игры
  allLevelCount = 2; // Кол-во уровней
  eventsUpFunction: () => void; // Фунция для евентов отпускания кнопок

  /**
   * Останавливает игру
   */
  stop() {
    super.stop();
    this.audioManager.musicStop('ark');
  }

  /**
   * Выполняет действия при подебе/проигрыше
   */
  changeStatusGame(status: string) {
    super.changeStatusGame(status, 'ark');
  }

  /**
   * Логика игры
   */
  update() {
    super.update();

    if (this.isBallOnPlatform) {
      this.ball.followForPlatform(this.platform.x, this.platform.width);
    } else {
      this.ball.move();
      this.checkCollisionBlocks();
      this.checkCollisionPlatform();
    }

    this.draw();
  }

  /**
   * Отрисовка игры
   */
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.platform.draw();
    this.ball.draw();
    this.blocks.draw();
  }

  /**
   * Устанавливает начальные значения для игры
   */
  setDefaultValues() {
    super.setDefaultValues();

    this.setDefaultPositions();

    this.currentLevel = 1;
    this.audioManager.musicPlay('ark');
  }

  /**
   * Инициализация менеджеров
   */
  initManagers() {
    super.initManagers('arkanoid');

    const musicList = [
      { name: 'ark', file: 'ark.mp3', loop: true, volume: 0.3 },
      { name: 'food', file: 'food.mp3', loop: false },
      { name: 'lose', file: 'lose.mp3', loop: false },
      { name: 'win', file: 'win.mp3', loop: false }
    ];

    this.audioManager.addMusicList(musicList);
  }

  /**
   * Инициализация элементов игры
   */
  initElements() {
    super.initElements();

    const platformOptions = {
      context: this.context,
      canvasWidth: this.canvas.width
    }

    const ballOptions = {
      context: this.context,
      callbackLose: this.changeStatusGame.bind(this),
      canvasSize: {
        width: this.canvas.width,
        height: this.canvas.height,
      }
    }

    this.platform = new Platform(platformOptions);
    this.ball = new Ball(ballOptions);
    this.blocks = new Blocks(this.context);
  }

  /**
   * Регистрирует функцию привязывая контекст, для обработкой эвентов клика
   */
  initEvents() {
    super.initEvents();

    this.eventsUpFunction = this.eventsKeyUp.bind(this);
  }

  /**
   * Навешивает обработчики событий
   */
  bindEvents() {
    super.bindEvents();

    document.addEventListener('keyup', this.eventsUpFunction);
  }

  /**
   * Удаляет обработчики событий
   */
  removeEvents() {
    super.removeEvents();

    document.removeEventListener('keyup', this.eventsUpFunction);
  }

  /**
   * Обработчик событий нажатия кнопок
   * @param event
   */
  eventsKeyDown(event?: KeyboardEvent) {
    if (event.code === 'Escape') {
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
  }

  /**
   * Обработчик событий отпускания кнопок кнопок
   * @param event
   * @private
   */
  private eventsKeyUp(event: KeyboardEvent) {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      this.platform.changeDirection(0);
    }
  }

  /**
   * Устанавливает значения по умолчанию для объектов игры
   * @private
   */
  private setDefaultPositions() {
    this.isBallOnPlatform = true;
    this.blocks.create(this.currentLevel);
    this.platform.setDefaultValues();
    this.ball.setDefaultValues();
  }

  /**
   * Проверка столкновения мяча и блоков
   * @private
   */
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

  /**
   * Проверка столкновения мяча и платформы
   * @private
   */
  private checkCollisionPlatform() {
    if (!this.ball.checkCollision(this.platform)) {
      return;
    }

    this.audioManager.musicPlay('food');

    this.ball.checkVelocityX(this.platform);
    this.ball.setDirectionY(-1);
  }

  /**
   * Проверяет игру на победу
   * Если не осталось живых блоков, переходим к следующему уровню
   * @private
   */
  private checkWin() {
    const aliveBlock = this.blocks.items.filter((item) => item.lives > 0);

    if (aliveBlock.length) {
      return;
    }

    this.nextLevel();
  }

  /**
   * Переход к следующему уровню
   * @private
   */
  private nextLevel() {
    /**
     * Если текущий уровень был последним, то игрок победил
     */
    if (this.currentLevel >= this.allLevelCount) {
      this.changeStatusGame('win');

      return;
    }

    this.currentLevel++;
    this.setDefaultPositions();
  }
}

export default Game;
