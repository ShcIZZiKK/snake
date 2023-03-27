abstract class DefaultGame {
  abstract canvas: HTMLCanvasElement;
  abstract context: CanvasRenderingContext2D;

  /**
   * Инициализация игры
   */
  abstract init(): void;

  /**
   * Запуск игры
   */
  abstract start(): void;

  /**
   * Перезапуск игры
   */
  abstract restart(): void;

  /**
   * Метод при проигрыше
   */
  abstract loseGame(): void;

  /**
   * Метод при победе
   */
  abstract winGame(): void;

  /**
   * Метод для выполнения логики игры
   */
  abstract update(): void;

  /**
   * Метод для отрисовки игры
   */
  abstract draw(): void;
}

export default DefaultGame;
