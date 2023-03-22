import Mediator from '../helpers/Mediator';
import GameManager from './GameManager';
import Utils from '../helpers/Utils';

interface test {
  current: number;
  max: number;
}

const mediator = new Mediator();

class UIManager {
  private static instance: UIManager;
  private uiManagerMenu: UIManagerMenu;
  private uiManagerScore: UIManagerScore;

  public static getInstance(): UIManager {
    if (!UIManager.instance) {
      UIManager.instance = new UIManager();
    }

    return UIManager.instance;
  }

  private constructor() {
    this.init();
  }

  private init(): void {
    this.uiManagerMenu = new UIManagerMenu();
    this.uiManagerScore = new UIManagerScore();
  }

  public setMenuItems(wrapper: HTMLElement, menuButtons: Array<string>) {
    this.uiManagerMenu.createMenuButtons(wrapper, menuButtons);
  }

  public setScoreItems(currentWrapper: HTMLElement, maxWrapper: HTMLElement) {
    this.uiManagerScore.setBlocks(currentWrapper, maxWrapper);
  }
}

class UIManagerMenu {
  private menuButtons: Array<HTMLElement> = [];
  private activeIndex = 0;
  private activeClass = 'is-active';

  constructor() {
    this.subscribes();
  }

  public createMenuButtons(wrapper: HTMLElement, menuButtons: Array<string>) {
    if (!wrapper || !menuButtons.length) {
      return;
    }

    menuButtons.forEach((button, index) => {
      const elem = document.createElement('button');
      const elemText = document.createTextNode(button);

      elem.appendChild(elemText);

      if (index === 0) {
        elem.className = this.activeClass;
        this.activeIndex = 0;
      }

      wrapper.appendChild(elem);

      this.menuButtons.push(elem);
    });
  }

  private changeActiveClassMenuButtons() {
    this.menuButtons.forEach((button, index) => {
      const method = index === this.activeIndex ? 'add' : 'remove';

      button.classList[method](this.activeClass);
    });
  }

  private subscribes() {
    mediator.subscribe('keyboard:up-arrow', () => {
      if (GameManager.stage !== 'menu') {
        return;
      }

      this.activeIndex =
        this.activeIndex === 0
          ? this.menuButtons.length - 1
          : this.activeIndex - 1;
      this.changeActiveClassMenuButtons();
    });

    mediator.subscribe('keyboard:down-arrow', () => {
      if (GameManager.stage !== 'menu') {
        return;
      }

      this.activeIndex =
        this.activeIndex === this.menuButtons.length - 1
          ? 0
          : this.activeIndex + 1;
      this.changeActiveClassMenuButtons();
    });

    mediator.subscribe('keyboard:enter', () => {
      if (GameManager.stage !== 'menu') {
        return;
      }

      mediator.publish('menu:enter', this.activeIndex);
    });
  }
}

class UIManagerScore {
  private current: HTMLElement;
  private max: HTMLElement;

  constructor() {
    this.subscribes();
  }

  setBlocks(current: HTMLElement, max: HTMLElement) {
    this.current = current;
    this.max = max;
  }

  private subscribes() {
    mediator.subscribe('store:update', (obj: test) => {
      if (GameManager.stage === 'menu') {
        return;
      }

      const { current, max } = obj;

      this.current.innerText = Utils.getFilledZeroText(current.toString());
      this.max.innerText = Utils.getFilledZeroText(max.toString());
    });
  }
}

export default UIManager;
