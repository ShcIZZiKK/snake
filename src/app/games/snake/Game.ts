// Helpers
import DefaultGame from '../../abstracts/DefaultGame';
import Mediator from '../../helpers/Mediator';

// Game elements
import Snake from './Snake';
import Food from './Food';

// Custom
const mediator = Mediator.getInstance();

class Game extends DefaultGame {
  snake: Snake; // Экземпляр змейки
  food: Food; // Экземпляр еды
  grid = 20; // Размер одной клеточки на поле
  countAnimationFrame = 0; // Техническая переменная для ограничения скорости змейки
  slowing = 20; // Размер замедления змейки, чем больше значение тем она медленнее, чем меньше, тем быстрее
  maxCells: number; // Кол-во очков для победы

  /**
   * Останавливает игру
   */
  stop() {
    super.stop();
    this.audioManager.musicStop('snake');
  }

  /**
   * Логика игры
   */
  update() {
    super.update();

    if (++this.countAnimationFrame < this.slowing) {
      return;
    }

    // Обнуляем переменную скорости
    this.countAnimationFrame = 0;

    this.draw();

    this.snake.cells.forEach((cell, index) => {
      // Если змейка добралась до еды
      if (cell.x === this.food.x && cell.y === this.food.y) {
        // увеличиваем длину змейки
        this.snake.addLengthSnake();

        this.audioManager.musicPlay('food');
        this.score++;
        this.storeManager.updateCurrentValue(this.score);

        if (this.isWin()) {
          this.changeStatusGame('win');
        } else {
          this.food.setRandomPosition(this.snake.cells);
        }

        if (this.slowing > 8) {
          this.slowing -= 0.1;
        }
      }

      // Проверяем, не столкнулась ли змея сама с собой
      for (let i = index + 1; i < this.snake.cells.length; i++) {
        if (cell.x === this.snake.cells[i].x && cell.y === this.snake.cells[i].y) {
          this.snake.changeColor('orange');
          this.snake.drawSnake();
          this.changeStatusGame('lose');
        }
      }
    });
  }

  /**
   * Выполняет действия при подебе/проигрыше
   */
  changeStatusGame(status: string) {
    super.changeStatusGame(status, 'snake');
  }

  /**
   * Отрисовка игры
   */
  draw() {
    // Очищаем игровое поле
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Рисуем еду
    this.food.draw();

    // Рисуем змейку
    this.snake.draw();
  }

  /**
   * Устанавливает начальные значения для игры
   * @private
   */
  setDefaultValues() {
    super.setDefaultValues();

    this.countAnimationFrame = 0;
    this.slowing = 20;

    this.snake.changeColor('green');
    this.snake.setDefaultValues();
    this.food.setRandomPosition(this.snake.cells);

    this.audioManager.musicPlay('snake');
  }

  /**
   * Инициализация менеджеров
   */
  initManagers() {
    super.initManagers('snake');

    const musicList = [
      { name: 'snake', file: 'snake.mp3', loop: true, volume: 0.3 },
      { name: 'food', file: 'food.mp3', loop: false },
      { name: 'lose', file: 'lose.mp3', loop: false },
      { name: 'win', file: 'win.mp3', loop: false },
    ];

    this.audioManager.addMusicList(musicList);
  }

  /**
   * Инициализация элементов игры
   */
  initElements() {
    super.initElements();

    this.maxCells = Math.floor(this.canvas.width / this.grid) * Math.floor(this.canvas.height / this.grid);

    const snakeProps = {
      context: this.context,
      grid: this.grid,
      color: 'green',
      size: {
        width: this.canvas.width,
        height: this.canvas.height
      }
    }
    this.snake = new Snake(snakeProps);

    const foodProps = {
      ...snakeProps,
      color: 'red'
    }
    this.food = new Food(foodProps);
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

    const { dx, dy } = this.snake.getDirection();

    switch (event.code) {
    case 'ArrowLeft':
      if (dx === 0) {
        this.snake.setDirection(-this.grid, 0);
      }

      break;
    case 'ArrowUp':
      if (dy === 0) {
        this.snake.setDirection(0, -this.grid);
      }

      break;
    case 'ArrowRight':
      if (dx === 0) {
        this.snake.setDirection(this.grid, 0);
      }

      break;
    case 'ArrowDown':
      if (dy === 0) {
        this.snake.setDirection(0, this.grid);
      }

      break;
    default:
      break;
    }
  }

  /**
   * Проверка на победу
   * Если длина змейки равна кол-ву очков для победы, то игрок победил
   * @private
   */
  private isWin() {
    return this.snake.cells.length >= this.maxCells;
  }
}

export default Game;
