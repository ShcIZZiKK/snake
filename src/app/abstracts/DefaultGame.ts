import AudioManager from '../managers/AudioManager';
import StoreManager from '../managers/StoreManager';
import Mediator from '../helpers/Mediator';

const mediator = Mediator.getInstance();

class DefaultGame {
  audioManager: AudioManager; // Аудио менеджер
  storeManager: StoreManager; // Хранилище очков
  canvas: HTMLCanvasElement; // Html элемент канваса
  context: CanvasRenderingContext2D; // Контекст канваса
  score = 0; // Кол-во набранных очков
  gameOver = false; // Закончена ли игра
  eventsKeyDownFunction: () => void; // Фунция для евентов

  /**
   * Инициализация игры и зависимостей
   */
  init() {
    this.initManagers();
    this.initElements();
    this.initEvents();
    this.bindEvents();
    this.start();
  }

  /**
   * Запуск игры
   */
  start() {
    this.setDefaultValues();
    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Останавливает игру
   */
  stop() {
    this.removeEvents();
    this.gameOver = true;
  }

  /**
   * Логика игры
   */
  update() {
    if (this.gameOver) {
      return;
    }

    requestAnimationFrame(this.update.bind(this));

    // Здесь методы вызов метода отрисовки и логики игры
  }

  /**
   * Выполняет действия при подебе/проигрыше
   */
  changeStatusGame(status: string, music: string) {
    this.audioManager.musicStop(music);
    this.gameOver = true;

    if (status === 'lose') {
      this.audioManager.musicPlay('lose');
      mediator.publish('game:lose', this.score);
    } else {
      this.audioManager.musicPlay('win');
      mediator.publish('game:win', this.score);
    }
  }

  /**
   * Инициализация менеджеров
   */
  initManagers(game?: string) {
    this.audioManager = new AudioManager();

    if (game) {
      this.storeManager = new StoreManager(game);
    }
  }

  /**
   * Инициализация элементов игры
   */
  initElements() {
    this.canvas = <HTMLCanvasElement>document.getElementById('game');
    this.context = this.canvas.getContext('2d');
  }

  /**
   * Регистрирует функцию привязывая контекст, для обработкой эвентов клика
   */
  initEvents() {
    this.eventsKeyDownFunction = this.eventsKeyDown.bind(this);
  }

  /**
   * Навешивает обработчики событий
   */
  bindEvents() {
    document.addEventListener('keydown', this.eventsKeyDownFunction);
  }

  /**
   * Удаляет обработчики событий
   */
  removeEvents() {
    document.removeEventListener('keydown', this.eventsKeyDownFunction);
  }

  /**
   * Обработчик событий нажатия кнопок
   */
  eventsKeyDown() {
    // Необходимо заполнить в дочернем классе
  }

  /**
   * Устанавливает значения по умолчанию
   */
  setDefaultValues() {
    this.gameOver = false;
    this.score = 0;

    this.storeManager.updateCurrentValue(this.score);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export default DefaultGame;
