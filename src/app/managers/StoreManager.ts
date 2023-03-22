import Mediator from '../helpers/Mediator';

const mediator = new Mediator();

interface GameStore {
  name: string,
  current: number,
  max: number
}

class StoreManager {
  private static instance: StoreManager;
  public static store: Array<GameStore> = [];

  public static getInstance(): StoreManager {
    if (!StoreManager.instance) {
      StoreManager.instance = new StoreManager();
    }

    return StoreManager.instance;
  }

  public setGamesList(games: Array<string>) {
    games.forEach((game) => {
      const gameStore = {
        name: game,
        current: 0,
        max: Number(localStorage.getItem(`${game}-max`)) || 0,
      }

      StoreManager.store.push(gameStore);
    });
  }

  public static updateCurrentValue(game: string, value: number) {
    const currentGame = StoreManager.store.find((item) => item.name === game);

    if (!currentGame) {
      return;
    }

    currentGame.current = value;

    if (value > currentGame.max) {
      currentGame.max = value;
      localStorage.setItem(`${game}-max`, value.toString());
    }

    mediator.publish('store:update',  { current: currentGame.current, max: currentGame.max })
  }
}

export default StoreManager;
