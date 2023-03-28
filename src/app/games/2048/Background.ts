// Interfaces
import { BackgroundOptions } from '../../interfaces/games/2048';

class Background {
  context: CanvasRenderingContext2D; // Контекст канваса
  width: number; // Ширина плитки
  height: number; // Высота плитки
  padding: number; // Расстояние между плитками плитки
  size: number; // Размер матрицы плиток
  color: string; // Цвет плиток
  defaultColor = '#abaeb2' // Цвет плиток по умолчанию

  constructor(options: BackgroundOptions) {
    this.context = options.context;
    this.width = options.width;
    this.height = options.height;
    this.size = options.size;
    this.padding = options.padding;
    this.color = options?.color || this.defaultColor;
  }

  /**
   * Рисует фон из плиток
   */
  public draw() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.context.fillStyle = this.color;
        const posX = (this.width * x) + (this.padding * x) + this.padding;
        const posY = (this.height * y) + (this.padding * y) + this.padding;
        this.context.fillRect(posX, posY, this.width, this.height);
      }
    }
  }
}

export default Background;
