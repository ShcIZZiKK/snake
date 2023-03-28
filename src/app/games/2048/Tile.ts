// Interfaces
import { Position, TileOptions } from '../../interfaces/games/2048';

class Tile {
  context: CanvasRenderingContext2D; // Контекст канваса
  id: number; // id плитки
  newX = 0; // Новая позиция плитки по Х
  newY = 0; // Новая позиция плитки по Y
  x = 0; // Текущая позиция плитки по Х
  y = 0; // Текущая позиция плитки по Y
  speed = 0.4; // Скорость движения плитки
  width: number; // Ширина плитки
  height: number; // Высота плитки
  padding: number; // Расстояние между плитками плитки
  colors = {
    2: '#a7d3fa',
    4: '#82c2fa',
    8: '#ffa500',
    16: '#ff8400',
    32: '#e36200',
    64: '#bf0000',
    128: '#e8dd4a',
    256: '#bf8104',
    512: '#ff009d',
    1024: '#fc0061',
    2048: '#fa0000'
  }; // Список цветов
  isAnimated = false; // Идёт ли сейчас анимация смещения плитки

  constructor(options: TileOptions) {
    this.context = options.context;
    this.id = options.id;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
    this.padding = options.padding;
  }

  /**
   * Задаёт новую позицию плитке
   * @param newPos
   */
  public changePosition(newPos: Position) {
    this.newX = newPos.x;
    this.newY = newPos.y;

    this.isAnimated = true;
  }

  /**
   * Рисует плитку
   * @param value
   */
  public draw(value: number) {
    if (!value) {
      return;
    }

    this.animateTile();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.context.fillStyle = this.colors[value];
    const posX = (this.width * this.x) + (this.padding * this.x) + this.padding;
    const posY = (this.height * this.y) + (this.padding * this.y) + this.padding;
    this.context.fillRect(posX, posY, this.width, this.height);
    this.context.fillStyle = 'white';
    this.context.textBaseline = "top";
    this.context.font = "52px Pixeboy";
    let left; // Сдвиг текста от левого края плитки

    switch (true) {
      case value < 10:
        left = 40;
        break;
      case value < 100:
        left = 30;
        break;
      case value < 1000:
        left = 18;
        break;
      default:
        left = 6;
        break;
    }

    this.context.fillText(value.toString(), posX + left, posY + 15);
  }

  /**
   * Если запущена анимация, смещает плитку
   */
  private animateTile() {
    if (this.isAnimated) {
      switch (true) {
      case this.x < this.newX:
        this.x += this.speed;

        if (this.x > this.newX) {
          this.x = this.newX;
        }

        break;
      case this.x > this.newX:
        this.x -= this.speed;

        if (this.x < this.newX) {
          this.x = this.newX;
        }
        break;
      case this.y < this.newY:
        this.y += this.speed;

        if (this.y > this.newY) {
          this.y = this.newY;
        }
        break;
      case this.y > this.newY:
        this.y -= this.speed;

        if (this.y < this.newY) {
          this.y = this.newY;
        }
        break;
      default:
        break;
      }

      if (this.x === this.newX && this.y === this.newY) {
        this.isAnimated = false;

        return;
      }
    }
  }
}

export default Tile;
