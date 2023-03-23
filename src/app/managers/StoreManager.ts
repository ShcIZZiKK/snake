import Mediator from '../helpers/Mediator';
import { GameScoreStoreItem } from '../interfaces';

const mediator = new Mediator();

class StoreManager {
  private static instance: StoreManager;
  private currentStore: GameScoreStoreItem;
  private store: Array<GameScoreStoreItem> = [];

  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }

    return StoreManager.instance;
  }

  public setStore(gameName: string) {
    const storeObject = this.store.find((item) => item.name === gameName);

    if (storeObject) {
      this.setCurrentStore(storeObject);
    } else {
      const gameStore: GameScoreStoreItem = {
        name: gameName,
        current: 0,
        max: Number(localStorage.getItem(`${gameName}-max`)) || 0,
      }

      this.store.push(gameStore);
      this.setCurrentStore(this.store[this.store.length - 1]);
    }
  }

  public updateCurrentValue(value: number) {
    if (!this.currentStore) {
      return;
    }

    this.currentStore.current = value;

    if (value > this.currentStore.max) {
      this.currentStore.max = value;
      localStorage.setItem(`${this.currentStore.name}-max`, value.toString());
    }

    this.publishStoreValue();
  }

  private setCurrentStore(store: GameScoreStoreItem) {
    this.currentStore = store;
    this.publishStoreValue();
  }

  private publishStoreValue() {
    mediator.publish('store:update',  {
      current: this.currentStore.current,
      max: this.currentStore.max
    });
  }
}

export default StoreManager;
