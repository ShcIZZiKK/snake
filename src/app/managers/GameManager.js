import AudioManager from './AudioManager';
import InputManager from './InputManager';
import UIManager from './UIManager';
import Mediator from '../helpers/Mediator';

const mediator = new Mediator();

class GameManager {
  constructor(games) {
    this.gamesList = games || [];
  }

  init() {
    this.audioManager = new AudioManager();
    this.inputManager = new InputManager();
    this.uiManager = new UIManager();

    this.#subscribes();
    this.#initInputManager();
    this.#initUIManager();
  }

  #initUIManager() {
    if (!this.uiManager) {
      return;
    }

    const buttons = this.gamesList.map((item) => item.name);

    this.uiManager.init(buttons);
  }

  #initInputManager() {
    if (!this.inputManager) {
      return;
    }

    this.inputManager.init();
  }

  #subscribes() {
    mediator.subscribe('game:enter', (index) => {
      const { game } = this.gamesList[index];

      game.init();
      game.start();
    });
  }
}

export default GameManager;
