// Helpers
import Utils from '../../helpers/Utils';

// Interfaces
import { Cell, FoodOptions } from '../../interfaces/games/snake';

class Food {
  context: CanvasRenderingContext2D; // Контекст канваса
  x = 0; // Начальная координата еды по X
  y = 0; // Начальная координата еды по Y
  color: string; // Цвет еды
  defaultColor = 'red'; // Цвет еды по умолчанию
  foodSize: number; // Размер ячейки еды
  cellCountX: number; // Количество ячеек где можем разместить еду по x
  cellCountY: number; // Количество ячеек где можем разместить еду по y

  constructor(options: FoodOptions) {
    this.context = options.context;
    this.foodSize = options.grid;
    this.color = options.color || this.defaultColor;
    this.x = this.foodSize;
    this.y = this.foodSize;
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
  setRandomPosition(snakeCells: Array<Cell>) {
    const randomX = Utils.getRandomInt(0, this.cellCountX) * this.foodSize;
    const randomY = Utils.getRandomInt(0, this.cellCountY) * this.foodSize;

    // Проверяем, не совпадает ли новая позиция с ячейкой занимаемой змейков
    // Если совпадает, повторно задаём позицию
    for (let i = 0; i < snakeCells.length; i++) {
      if (snakeCells[i].x === randomX && snakeCells[i].y === randomY) {
        this.setRandomPosition(snakeCells);

        break;
      }
    }

    this.x = randomX;
    this.y = randomY;
  }
}

export default Food;
