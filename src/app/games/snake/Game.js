import Snake from './Snake';
import Food from './Food';
import Mediator from '../../helpers/Mediator';

const mediator = new Mediator();

class Game {
  constructor() {
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
  }

  init() {
    this.#initElements();
    this.#subscribes();
  }

  start() {
    requestAnimationFrame(this.loop.bind(this));
  }

  loop() {
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
      this.food.setRandomPosition();
    });

    mediator.subscribe('snake:dead', () => {
      this.snake.restart();
      this.food.setRandomPosition();
    });

    mediator.subscribe('keyboard:left-arrow', () => {
      const { dx } = this.snake.getDirection();

      if (dx === 0) {
        this.snake.setDirection(-this.grid, 0);
      }
    });

    mediator.subscribe('keyboard:up-arrow', () => {
      const { dy } = this.snake.getDirection();

      if (dy === 0) {
        this.snake.setDirection(0, -this.grid);
      }
    });

    mediator.subscribe('keyboard:right-arrow', () => {
      const { dx } = this.snake.getDirection();

      if (dx === 0) {
        this.snake.setDirection(this.grid, 0);
      }
    });

    mediator.subscribe('keyboard:down-arrow', () => {
      const { dy } = this.snake.getDirection();

      if (dy === 0) {
        this.snake.setDirection(0, this.grid);
      }
    });
  }
}

export default Game;
