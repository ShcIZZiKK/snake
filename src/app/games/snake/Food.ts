import Utils from '../../helpers/Utils';

interface CanvasSize {
  width: number;
  height: number
}

interface FoodOptions {
  context: CanvasRenderingContext2D;
  grid: number;
  color: string;
  size: CanvasSize
}

class Food {
  context: CanvasRenderingContext2D; // Контекст канваса
  x = 0; // Начальная координата еды по X
  y = 0; // Начальная координата еды по Y
  color: string; // Цвет змейки
  defaultColor = 'red'; // Цвет змейки по умолчанию
  foodSize: number; // Размер ячейки змейки
  cellCountX: number; // Количество ячеек где можем разместить еду по x
  cellCountY: number; // Количество ячеек где можем разместить еду по y

  constructor(options: FoodOptions) {
    this.context = options.context;
    this.foodSize = options.grid;
    this.color = options.color || this.defaultColor;
    this.x = this.foodSize * 20;
    this.y = this.foodSize * 20;
    this.cellCountX = Math.floor(options.size.width / this.foodSize);
    this.cellCountY = Math.floor(options.size.height / this.foodSize);
  }

  /**
   * Рисует еду
   */
  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.foodSize - 1, this.foodSize - 1);
  }

  /**
   * Задаём рандомную позицию еде
   */
  setRandomPosition() {
    this.x = Utils.getRandomInt(0, this.cellCountX) * this.foodSize;
    this.y = Utils.getRandomInt(0, this.cellCountY) * this.foodSize;
  }
}

export default Food;
