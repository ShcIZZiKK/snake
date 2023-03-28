// Interfaces
import { PlatformOptions } from '../../interfaces/games/arkanoid';

class Platform {
  context: CanvasRenderingContext2D; // Контекст канваса
  canvasWidth: number; // Ширина канваса
  x = 175; // Текущая позиция по Х
  y = 409; // Текущая позиция по Y
  maxSpeed = 6; // Максимальная скорость платформы
  dx = 0; // Текущая скорость по x
  width = 90; // Ширина платформы
  height = 16; // Высота платформы
  segmentCount = 8; // Кол-во отрезков на платформе
  segmentsSizes: Array<number> = []; // Размеры отрезков на платфорем. Нужно для придания ускорения мячу
  color: string; // Цвет платформы
  defaultColor = 'blue'; // Цвет платформы по умолчанию

  constructor(options: PlatformOptions) {
    this.context = options.context;
    this.canvasWidth = options.canvasWidth;
    this.color = options?.color || this.defaultColor;

    // Размер одного отрезка
    const segmentSize = this.width / this.segmentCount;
    // Кол-во отрезков. Так как ускорение для мяча семетрично относительно столкновения с левой или правой
    // стороны платформы, то сокращаем segmentCount вдвое
    const segmentSizesLength = Math.floor(this.segmentCount / 2);

    for (let i = 1; i <= segmentSizesLength; i++) {
      this.segmentsSizes.push(segmentSize * i);
    }
  }

  /**
   * Устанавливает стандартные значения платформы
   */
  public setDefaultValues() {
    this.x = 175;
    this.y = 409;
  }

  /**
   * Рисует платформу
   */
  public draw() {
    this.update();

    this.context.fillStyle = 'blue';
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  /**
   * Двигает платформу
   */
  public update() {
    if (this.isOutside()) {
      return;
    }

    this.x += this.dx;
  }

  /**
   * Изменяет направление движения платформы
   * @param direction - 1 вправо, -1 влево
   */
  public changeDirection(direction: number) {
    this.dx = this.maxSpeed * direction;
  }

  /**
   * Проверяет не упёрлась ли платформа в край канваса
   * @private
   */
  private isOutside() {
    const rightOutside = this.dx > 0 && this.x + this.width >= this.canvasWidth;
    const leftOutside = this.dx < 0 && this.x <= 0;

    return rightOutside || leftOutside;
  }
}

export default Platform;
