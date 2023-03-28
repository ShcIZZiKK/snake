// Interfaces
import { Block } from '../../interfaces/games/arkanoid';

class Blocks {
  context: CanvasRenderingContext2D; // Контекст канваса
  items: Array<Block> = []; // Массив блоков
  width = 60; // Ширина одного блока
  height = 16; // Высота одного блока
  indent = 10; // Растояние между блоками
  columns = 6; // Количество колонок
  rows = 3; // Количество строк
  offsetWindow = 15; // Растояние от края холста

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  /**
   * Рисует блоки
   */
  public draw() {
    this.items.forEach((item) => {
      if (item.lives < 1) {
        return;
      }

      this.context.fillStyle = item.color;

      this.context.fillRect(item.x, item.y, item.width, item.height);
    });
  }

  /**
   * Метод для создания блоков в зависимости от уровня
   */
  public create(level: number) {
    this.items = [];

    switch (level) {
      case 1:
        this.createFirstLevel();
        break;
      case 2:
        this.createSecondLevel();
        break;
      default:
        this.createFirstLevel();
        break;
    }
  }

  /**
   * Создаёт блоки для 1-го уровня
   * @private
   */
  private createFirstLevel() {
    const colors = ['red', 'orange', 'yellow', 'yellow', 'orange', 'red']
    this.rows = 3;

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        this.items.push({
          x: (this.width + this.indent) * column + this.offsetWindow,
          y: (this.height + this.indent) * row + this.offsetWindow,
          width: this.width,
          height: this.height,
          color: colors[column],
          lives: 1
        });
      }
    }
  }

  /**
   * Создаёт блоки для 2-го уровня
   * @private
   */
  private createSecondLevel() {
    const colors = ['red', 'orange', 'yellow', 'gray']
    const missColumns = [1, 4];
    this.rows = 4;

    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++) {
        if (missColumns.includes(column)) {
          continue;
        }

        this.items.push({
          x: (this.width + this.indent) * column + this.offsetWindow,
          y: (this.height + this.indent) * row + this.offsetWindow,
          width: this.width,
          height: this.height,
          color: colors[row],
          lives: row === 3 ? 3 : 1
        });
      }
    }
  }
}

export default Blocks;
