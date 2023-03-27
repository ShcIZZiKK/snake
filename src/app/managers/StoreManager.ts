import Mediator from '../helpers/Mediator';

const mediator = Mediator.getInstance();

class StoreManager {
  private readonly gameName: string;
  private currentValue = 0;
  private maxValue = 0;

  constructor(name: string) {
    this.gameName = name;
    this.initStore();
    this.publishStoreValue();
  }

  private initStore() {
    this.currentValue = 0;
    this.maxValue = Number(localStorage.getItem(`${this.gameName}-max`)) || 0;
  }

  public updateCurrentValue(value: number) {
    this.currentValue = value;

    if (value > this.maxValue) {
      this.maxValue = value;
      localStorage.setItem(`${this.gameName}-max`, value.toString());
    }

    this.publishStoreValue();
  }

  private publishStoreValue() {
    mediator.publish('store:update',  {
      current: this.currentValue,
      max: this.maxValue
    });
  }
}

export default StoreManager;
