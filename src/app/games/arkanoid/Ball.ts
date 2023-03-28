// Game elements
import Platform from './Platform';

// Interfaces
import { BallOptions, Block, CanvasSize } from '../../interfaces/games/arkanoid';

class Ball {
  context: CanvasRenderingContext2D; // Контекст канваса
  canvasSize: CanvasSize; // Размер холста
  callbackLose: (status: string) => void; // Кэлбэк в случае проигрыша
  x = 220; // Позиция мяча по X
  y = 399; // Позиция мяча по Y
  radius = 10; // Радиус мяча
  minVelocityX = 1; // Минимальное ускорение мяча
  maxVelocityX = 4; // Максимальное ускорение мяча
  velocityX = 1; // Ускорение по оси x
  velocityY = 2; // Ускорение по оси y
  dx = 0; // Текущая скорость по x
  dy = 0; // Текущая скорость по y
  color: string; // Цвет мяча
  defaultColor = 'green'; // Цвет мяча по умолчанию

  constructor(options: BallOptions) {
    this.context = options.context;
    this.callbackLose = options.callbackLose;
    this.color = options?.color || this.defaultColor;
    this.canvasSize = options.canvasSize;
  }

  /**
   * Устанавливает значения по умолчанию
   */
  public setDefaultValues() {
    this.x = 220;
    this.y = 399;
    this.velocityX = 1;
    this.velocityY = 2;
    this.dx = 0;
    this.dy = 0;
  }

  /**
   * Рисует мяч на холсте
   */
  public draw() {
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    this.context.closePath();
    this.context.fill();
  }

  /**
   * Проверка столкновений
   * @param element
   */
  public checkCollision(element: Block | Platform) {
    const { x, y } = this.getNextPosition();

    return x < element.x + element.width &&
      x + this.radius > element.x &&
      y < element.y + element.height &&
      y + this.radius > element.y;
  }

  /**
   * Изменяет направление движения мяча по X
   * @param direction - 1 - вправо, -1 влево
   */
  public setDirectionX(direction: number) {
    this.dx = this.velocityX * direction;
  }

  /**
   * Изменяет направление движения мяча по Y
   * @param direction - 1 - вниз, -1 вверх
   */
  public setDirectionY(direction: number) {
    this.dy = this.velocityY * direction;
  }

  /**
   * Изменяет направление движения мяча по Y на противоположное текущему направлению
   */
  public revertDirectionY() {
    this.dy = -this.dy;
  }

  /**
   * Расчитывает скорость мяча по Х, в зависимости от удалённости от центра платформы
   * @param platform
   */
  public checkVelocityX(platform: Platform) {
    const { x } = this.getNextPosition(); // Позиция мяча при следующем фрейма
    const centerPlatform = platform.x + platform.width / 2; // Центр платформы
    const direction = x > centerPlatform ? 1 : -1; // Направление мяча после столкновения
    const position = Math.abs(x - centerPlatform); // Растояние от мяча до центра платформы
    const allSegmentsCount = platform.segmentsSizes.length; // Кол-во отрезков на платформе

    // Если текущее расстояние до центра, меньше минимального отрезка платформы
    // задаём минимальное ускорение мячу
    const isMinVelocity = position <= platform.segmentsSizes[0];

    if (isMinVelocity) {
      this.velocityX = this.minVelocityX;
      this.setDirectionX(direction);

      return;
    }

    // Если текущее расстояние до центра, меньше или равно максимальному отрезку платформы
    // и больше предшествующего отреза, задаём максимальное ускорение мячу
    const isMaxVelocity = position > platform.segmentsSizes[allSegmentsCount - 2] &&
      position <= platform.segmentsSizes[allSegmentsCount - 1];

    if (isMaxVelocity) {
      this.velocityX = this.maxVelocityX;
      this.setDirectionX(direction);

      return;
    }

    // Высчитываем размер ускорения
    // 1. Берём разниму между минимальным и максимальным ускорением
    // 2. Каждый сегмент это по факту отрезок имеющий начало и конец, где конец предыдущего будет началом следующего.
    //    Поэтому вычитаем единицу из общего кол-ва сегментов.
    // 3. Делим первое на второе, получаем размер прибавляемого ускорения, за каждый отрезок
    const step = (this.maxVelocityX - this.minVelocityX) / (allSegmentsCount - 1);

    // Проходим по всем сегментам
    for (let i = 1; i < allSegmentsCount - 1; i++) {
      // Если текущая позиция мяча, входит в отрезок текущего сегмента, то к минимальному ускорению
      // добавляем шаг (размер ускорения) помноженного на индекс сегмента,
      // ведь чем дальше сегмент, тем больше ускорение
      if (position > platform.segmentsSizes[i - 1] && position <= platform.segmentsSizes[i]) {
        this.velocityX = this.minVelocityX + (step * i);
        this.setDirectionX(direction);

        break;
      }
    }
  }

  /**
   * Изменяет позицию мяча
   */
  public move() {
    this.checkOutside();

    this.x += this.dx;
    this.y += this.dy;
  }

  /**
   * Центрируем элемент по оси X относительно платформы
   * @param platformX
   * @param platformWidth
   */
  public followForPlatform(platformX: number, platformWidth: number) {
    this.x = platformX + (platformWidth / 2);
  }

  /**
   * Проверка выхода за границы холста
   * @private
   */
  private checkOutside() {
    const { x, y } = this.getNextPosition();

    if (x < 0) {
      this.setDirectionX(1);
    } else if (x + this.radius > 440) {
      this.setDirectionX(-1);
    }

    if (y < 0) {
      this.setDirectionY(1);
    } else if (y + this.radius > 440) {
      this.callbackLose('lose');
    }
  }

  /**
   * Получает следующую позицию мяча
   * Это нужно чтобы при проверке столкновений использовалась следующая позиция мяча
   * чтобы не было наложения мяча на другие элементы
   * @private
   */
  private getNextPosition() {
    return {
      x: this.x + this.dx,
      y: this.y + this.dy
    }
  }
}

export default Ball;
