import Mediator from '../helpers/Mediator';

const mediator = new Mediator();

class UIManager {
  constructor() {
    this.game = null;
    this.mainMenu = null;
    this.status = null;
    this.score = null;
    this.stage = 'menu';
    this.menuButtons = [];
    this.activeIndex = 0;
  }

  init(menuButtons): void {
    this.#getElements();
    this.#createMenuButtons(menuButtons);
    this.#subscribes();
  }

  #getElements() {
    this.game = document.getElementById('game');
    this.mainMenu = document.getElementById('game-menu');
    this.status = document.getElementById('game-status');
    this.score = document.getElementById('game-score');
  }

  #createMenuButtons(menuButtons) {
    if (!this.mainMenu || !menuButtons.length) {
      return;
    }

    menuButtons.forEach((button, index) => {
      const elem = document.createElement('button');
      const elemText = document.createTextNode(button);

      elem.appendChild(elemText);

      if (index === 0) {
        elem.className = 'is-active';
        this.activeIndex = 0;
      }

      this.mainMenu.appendChild(elem);

      this.menuButtons.push(elem);
    });
  }

  #subscribes() {
    mediator.subscribe('keyboard:up-arrow', () => {
      if (this.stage !== 'menu') {
        return;
      }

      this.activeIndex = this.activeIndex === 0
        ? this.menuButtons.length - 1
        : this.activeIndex - 1;
      this.#changeActiveClassMenuButtons();
    });

    mediator.subscribe('keyboard:down-arrow', () => {
      if (this.stage !== 'menu') {
        return;
      }

      this.activeIndex = this.activeIndex === this.menuButtons.length - 1
        ? 0
        : this.activeIndex + 1;
      this.#changeActiveClassMenuButtons();
    });

    mediator.subscribe('keyboard:enter', () => {
      if (this.stage !== 'menu') {
        return;
      }

      this.mainMenu.classList.remove('is-active');
      this.game.classList.add('is-active');
      this.score.classList.add('is-active');

      mediator.publish('game:enter', this.activeIndex);
    });
  }

  #changeActiveClassMenuButtons() {
    this.menuButtons.forEach((button, index) => {
      const method = index === this.activeIndex ? 'add' : 'remove';

      button.classList[method]('is-active');
    });
  }
}

export default UIManager;
