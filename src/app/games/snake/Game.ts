import Snake from './Snake';
import Food from './Food';
import AudioManager from '../../managers/AudioManager';
import StoreManager from '../../managers/StoreManager';
import Mediator from '../../helpers/Mediator';
import DefaultGame from '../../abstracts/DefaultGame';

const mediator = Mediator.getInstance();

class Game extends DefaultGame {
  audioManager: AudioManager; // Аудио менеджер
  storeManager: StoreManager; // Хранилище очков
  canvas: HTMLCanvasElement; // Html элемент канваса
  context: CanvasRenderingContext2D; // Контекст канваса
  snake: Snake; // Экземпляр змейки
  food: Food; // Экземпляр еды
  grid = 20; // Размер одной клеточки на поле
  countAnimationFrame = 0; // Техническая переменная для ограничения скорости змейки
  slowing = 20; // Размер замедления змейки, чем больше значение тем она медленнее, чем меньше, тем быстрее
  gameOver = false; // Закончена ли игра
  score = 0; // Кол-во набранных очков
  maxCells: number;

  init() {
    this.initManagers();
    this.initElements();
    this.bindEvents();
    this.start();
  }

  start() {
    this.audioManager.musicPlay('snake');
    this.gameOver = false;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    requestAnimationFrame(this.update.bind(this));
  }

  restart() {
    this.snake.changeColor('green');
    this.snake.setDefaultValues();
    this.food.setRandomPosition(this.snake.cells);
    this.start();
  }

  update() {
    if (this.gameOver) {
      return;
    }

    requestAnimationFrame(this.update.bind(this));

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
          this.winGame();
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
          this.loseGame();
        }
      }
    });
  }

  draw() {
    // Очищаем игровое поле
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Рисуем еду
    this.food.draw();

    // Рисуем змейку
    this.snake.draw();
  }

  loseGame() {
    this.audioManager.musicStop('snake');
    this.audioManager.musicPlay('lose');
    this.gameOver = true;

    mediator.publish('game:lose', this.score);

    this.score = 0;
    this.storeManager.updateCurrentValue(this.score);
  }

  winGame() {
    this.audioManager.musicStop('snake');
    this.audioManager.musicPlay('win');
    this.gameOver = true;

    mediator.publish('game:win', this.score);

    this.score = 0;
    this.storeManager.updateCurrentValue(this.score);
  }

  private isWin() {
    return this.snake.cells.length >= this.maxCells;
  }

  private initManagers() {
    const musicList = [
      { name: 'snake', file: 'snake.mp3', loop: true },
      { name: 'food', file: 'food.mp3', loop: false },
      { name: 'lose', file: 'lose.mp3', loop: false },
      { name: 'win', file: 'win.mp3', loop: false },
    ];

    this.audioManager = new AudioManager();
    this.audioManager.addMusicList(musicList);

    this.storeManager = new StoreManager('snake');
  }

  private initElements() {
    this.canvas = <HTMLCanvasElement>document.getElementById('game');
    this.context = this.canvas.getContext('2d');
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

  private bindEvents() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        this.audioManager.musicStop('snake');
        this.gameOver = true;

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
    });
  }
}

export default Game;
