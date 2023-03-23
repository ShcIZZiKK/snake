import Mediator from '../../helpers/Mediator';

const mediator = new Mediator();

class Snake {
  constructor() {
    /**
     * Начальная координата по Х
     * @type {number}
     */
    this.x = 200;

    /**
     * Начальная координата по Y
     * @type {number}
     */
    this.y = 200;

    /**
     * Скорость змейки по Х
     * @type {number}
     */
    this.dx = 20;

    /**
     * Скорость змейки по Y
     * @type {number}
     */
    this.dy = 0;

    /**
     * Тащим за собой хвост, который пока пустой
     * @type {*[]}
     */
    this.cells = [];

    /**
     * Стартовая длина змейки — 4 клеточки
     * @type {number}
     */
    this.maxCells = 4;

    this.defaultColor = 'green';
  }

  init(options) {
    this.canvas = options.canvas;
    this.grid = options.grid;
    this.context = options.context;
    this.color = options.color || this.defaultColor;

    this.dx = this.grid;
    this.x = this.grid * 10;
    this.y = this.grid * 10;
  }

  changePosition() {
    this.x += this.dx;
    this.y += this.dy;

    this.#checkOutsideX();
    this.#checkOutsideY();
    this.#move();
  }

  drawSnake(foodPosition) {
    // Одно движение змейки — один новый нарисованный квадратик
    this.context.fillStyle = this.color;

    // Обрабатываем каждый элемент змейки
    this.cells.forEach((cell, index) => {
      // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, чтобы
      // вокруг них образовалась чёрная граница
      this.context.fillRect(cell.x, cell.y, this.grid - 1, this.grid - 1);

      // Если змейка добралась до еды
      if (cell.x === foodPosition.x && cell.y === foodPosition.y) {
        // увеличиваем длину змейки
        this.maxCells++;

        mediator.publish('food:eat');
      }

      // Проверяем, не столкнулась ли змея сама с собой
      // Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две
      // клетки с одинаковыми координатами
      for (let i = index + 1; i < this.cells.length; i++) {
        // Если такие клетки есть — начинаем игру заново
        if (cell.x === this.cells[i].x && cell.y === this.cells[i].y) {
          this.context.fillStyle = 'orange';
          mediator.publish('snake:dead');
        }
      }
    });
  }

  setDirection(dx, dy) {
    this.dx = dx;
    this.dy = dy;
  }

  getDirection() {
    return {
      dx: this.dx,
      dy: this.dy,
    };
  }

  restart() {
    // Задаём стартовые параметры основным переменным
    this.x = 160;
    this.y = 160;
    this.cells = [];
    this.maxCells = 4;
    this.dx = this.grid;
    this.dy = 0;
  }

  /**
   * Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной строны
   */
  #checkOutsideX() {
    if (this.x < 0) {
      this.x = this.canvas.width - this.grid;
    } else if (this.x >= this.canvas.width) {
      this.x = 0;
    }
  }

  /**
     * Делаем то же самое для движения по вертикали
     */
  #checkOutsideY() {
    if (this.y < 0) {
      this.y = this.canvas.height - this.grid;
    } else if (this.y >= this.canvas.height) {
      this.y = 0;
    }
  }

  /**
     * Двигаем змейку
     */
  #move() {
    // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем
    // её координаты в начало массива, который отвечает за всю змейку
    this.cells.unshift({ x: this.x, y: this.y });

    // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и
    // постоянно освобождает клетки после себя
    if (this.cells.length > this.maxCells) {
      this.cells.pop();
    }
  }
}

export default Snake;
