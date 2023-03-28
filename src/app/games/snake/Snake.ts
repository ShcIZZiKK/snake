// Interfaces
import { Cell, CanvasSize, SnakeOptions } from '../../interfaces/games/snake';

class Snake {
  context: CanvasRenderingContext2D; // Контекст канваса
  canvasSize: CanvasSize; // Размер канваса
  x = 200; // Начальная координата по Х
  y = 200; // Начальная координата по Y
  dx = 20; // Скорость змейки по Х
  dy = 0; // Скорость змейки по Y
  cells: Array<Cell> = []; // Ячейки змейки
  cellsCount = 4; // Стартовая длина змейки — 4 клеточки
  color: string; // Цвет змейки
  defaultColor = 'green'; // Цвет змейки по умолчанию
  cellSize: number; // Размер ячейки змейки

  constructor(options: SnakeOptions) {
    this.context = options.context;
    this.canvasSize = options.size;
    this.cellSize = options.grid;
    this.color = options.color || this.defaultColor;

    this.dx = this.cellSize;
    this.x = this.cellSize * 10;
    this.y = this.cellSize * 10;
  }

  /**
   * Задаём стартовые параметры основным переменным
   */
  setDefaultValues() {
    this.x = this.cellSize * 10;
    this.y = this.cellSize * 10;
    this.cells = [];
    this.cellsCount = 4;
    this.dx = this.cellSize;
    this.dy = 0;
  }

  /**
   * Изменяем позицию змейки
   */
  draw() {
    this.x += this.dx;
    this.y += this.dy;

    this.checkOutsideX();
    this.checkOutsideY();
    this.move();
    this.drawSnake();
  }

  /**
   * Рисуем змейку
   */
  drawSnake() {
    this.context.fillStyle = this.color;

    // Рисуем каждую ячейку змейки
    this.cells.forEach((cell) => {
      this.context.fillRect(cell.x, cell.y, this.cellSize - 1, this.cellSize - 1);
    });
  }

  /**
   * Увеличивает длину змейки
   */
  addLengthSnake() {
    this.cellsCount++;
  }

  /**
   * Изменяет цвет змейки
   * @param color
   */
  changeColor(color: string) {
    this.color = color;
  }

  /**
   * Изменяет направление движения змейки
   * @param dx
   * @param dy
   */
  setDirection(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  /**
   * Возвращает текущее направление змейки
   */
  getDirection() {
    return {
      dx: this.dx,
      dy: this.dy,
    };
  }

  /**
   * Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной стороны
   */
  private checkOutsideX() {
    if (this.x < 0) {
      this.x = this.canvasSize.width - this.cellSize;
    } else if (this.x >= this.canvasSize.width) {
      this.x = 0;
    }
  }

  /**
   * Если змейка достигла края поля по вертикали — продолжаем её движение с противоположной стороны
   */
  private checkOutsideY() {
    if (this.y < 0) {
      this.y = this.canvasSize.height - this.cellSize;
    } else if (this.y >= this.canvasSize.height) {
      this.y = 0;
    }
  }

  /**
   * Двигаем змейку
   * путём добавления в начало массива новой ячейки
   * и удаления последнего элемента из массива
   */
  private move() {
    this.cells.unshift({ x: this.x, y: this.y });

    if (this.cells.length > this.cellsCount) {
      this.cells.pop();
    }
  }
}

export default Snake;
