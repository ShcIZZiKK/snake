interface Cell {
  x: number;
  y: number;
}

interface SnakeOptions {
  context: CanvasRenderingContext2D;
  grid: number;
  color: string;
  size: CanvasSize
}

interface CanvasSize {
  width: number;
  height: number
}

class Snake {
  context: CanvasRenderingContext2D; // Контекст канваса
  canvasSize: CanvasSize; // Размер канваса
  x = 200; // Начальная координата по Х
  y = 200; // Начальная координата по Y
  dx = 20; // Скорость змейки по Х
  dy = 0; // Скорость змейки по Y
  cells: Array<Cell> = []; // Тащим за собой хвост, который пока пустой
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
    this.x = 160;
    this.y = 160;
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

  drawSnake() {
    this.context.fillStyle = this.color;

    // Обрабатываем каждый элемент змейки
    this.cells.forEach((cell) => {
      this.context.fillRect(cell.x, cell.y, this.cellSize - 1, this.cellSize - 1);
    });
  }

  addLengthSnake() {
    this.cellsCount++;
  }

  changeColor(color: string) {
    this.color = color;
  }

  setDirection(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

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
   */
  private move() {
    this.cells.unshift({ x: this.x, y: this.y });

    if (this.cells.length > this.cellsCount) {
      this.cells.pop();
    }
  }
}

export default Snake;
