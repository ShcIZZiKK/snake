import Snake from './Snake';
import Food from './Food';
import AudioManager from '../../managers/AudioManager';
import StoreManager from '../../managers/StoreManager';
import Mediator from '../../helpers/Mediator';

const mediator = new Mediator();

class Game {
  constructor() {
    this.score = 0;

    /**
     * Поле, на котором всё будет происходить, — тоже как бы переменная
     */
    this.canvas = null;

    /**
     * Классическая змейка — двухмерная, сделаем такую же
     */
    this.context = null;

    /**
     * Размер одной клеточки на поле — 24 пикселя
     * @type {number}
     */
    this.grid = 20;

    this.count = 0;

    this.snake = null;

    this.gameOver = false;
  }

  init() {
    this.#initAudioManager();
    this.#initStoreManager();
    this.#initElements();
    this.#subscribes();
  }

  #initAudioManager() {
    const musicList = [
      { name: 'snake', file: 'snake.mp3', loop: true },
      { name: 'food', file: 'food.mp3', loop: false },
      { name: 'lose', file: 'lose.mp3', loop: false }
    ];

    this.audioManager = new AudioManager();
    this.audioManager.addMusicList(musicList);
  }

  #initStoreManager() {
    this.storeManager = StoreManager.getInstance();
    this.storeManager.setStore('snake');
  }

  start() {
    this.audioManager.musicPlay('snake');
    this.gameOver = false;
    requestAnimationFrame(this.loop.bind(this));
  }

  stop() {
    this.gameOver = true;
  }

  restart() {
    this.snake.restart();
    this.food.setRandomPosition();
    this.start();
  }

  loop() {
    if (this.gameOver) {
      return;
    }

    requestAnimationFrame(this.loop.bind(this));

    if (++this.count < 20) {
      return;
    }
    // Обнуляем переменную скорости
    this.count = 0;
    // Очищаем игровое поле
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Двигаем змейку с нужной скоростью
    this.snake.changePosition();

    // Рисуем еду
    this.food.drawFood();

    // Получаем координаты еды
    const { x: foodX, y: foodY } = this.food.getPosition();

    // Рисуем змею
    this.snake.drawSnake({
      x: foodX,
      y: foodY,
    });
  }

  #initElements() {
    this.canvas = document.getElementById('game');
    this.context = this.canvas.getContext('2d');
    this.snake = new Snake();
    this.snake.init({
      canvas: this.canvas,
      context: this.context,
      grid: this.grid,
      color: 'green',
    });
    this.food = new Food();
    this.food.init({
      context: this.context,
      grid: this.grid,
      color: 'red',
    });
  }

  #subscribes() {
    mediator.subscribe('food:eat', () => {
      this.audioManager.musicPlay('food');
      this.score++;
      this.storeManager.updateCurrentValue(this.score);

      this.food.setRandomPosition();
    });

    mediator.subscribe('snake:dead', () => {
      this.audioManager.musicStop('snake');
      this.audioManager.musicPlay('lose');
      this.stop();

      mediator.publish('game:lose', this.score);

      this.score = 0;
      this.storeManager.updateCurrentValue(this.score);
    });

    mediator.subscribe('keyboard:ArrowLeft', () => {
      const { dx } = this.snake.getDirection();

      if (dx === 0) {
        this.snake.setDirection(-this.grid, 0);
      }
    });

    mediator.subscribe('keyboard:ArrowUp', () => {
      const { dy } = this.snake.getDirection();

      if (dy === 0) {
        this.snake.setDirection(0, -this.grid);
      }
    });

    mediator.subscribe('keyboard:ArrowRight', () => {
      const { dx } = this.snake.getDirection();

      if (dx === 0) {
        this.snake.setDirection(this.grid, 0);
      }
    });

    mediator.subscribe('keyboard:ArrowDown', () => {
      const { dy } = this.snake.getDirection();

      if (dy === 0) {
        this.snake.setDirection(0, this.grid);
      }
    });
  }
}

export default Game;
