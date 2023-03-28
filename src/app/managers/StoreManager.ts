import Mediator from '../helpers/Mediator';

const mediator = Mediator.getInstance();

class StoreManager {
  private readonly gameName: string; // Название игры для поиска сохраннёных данных
  private currentValue = 0; // Текущее кол-во очков в игре
  private maxValue = 0; // Максимальное кол-во очков в игре

  constructor(name: string) {
    this.gameName = name;
    this.initStore();
    this.publishStoreValue();
  }

  /**
   * Инициализирует хранилище, получает максимальное значение из localStorage
   * @private
   */
  private initStore() {
    this.currentValue = 0;
    this.maxValue = Number(localStorage.getItem(`${this.gameName}-max`)) || 0;
  }

  /**
   * Обновляет текущее значение в хранилище
   * @param value
   */
  public updateCurrentValue(value: number) {
    this.currentValue = value;

    // Если текущее значение больше максимального, то обновляем и сохраняем максимальное значение
    if (value > this.maxValue) {
      this.maxValue = value;
      localStorage.setItem(`${this.gameName}-max`, value.toString());
    }

    this.publishStoreValue();
  }

  /**
   * Сообщает через медиатор, что значение обновленно
   * @private
   */
  private publishStoreValue() {
    mediator.publish('store:update',  {
      current: this.currentValue,
      max: this.maxValue
    });
  }
}

export default StoreManager;
