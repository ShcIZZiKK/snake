import AudioManager from './AudioManager';
import GameManager from './GameManager';
import Mediator from '../helpers/Mediator';
import Utils from '../helpers/Utils';
import { GameScore, ResultBlocks, ResultBlocksButton } from '../interfaces';

const mediator = new Mediator();

class UIManager {
  private static instance: UIManager;
  private uiManagerMenu: UIManagerMenu;
  private uiManagerScore: UIManagerScore;
  private uiManagerResult: UIManagerResult;

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
    this.uiManagerResult = new UIManagerResult();
  }

  public setMenuItems(wrapper: HTMLElement, menuButtons: Array<string>) {
    this.uiManagerMenu.createMenuButtons(wrapper, menuButtons);
  }

  public setScoreItems(currentWrapper: HTMLElement, maxWrapper: HTMLElement) {
    this.uiManagerScore.setBlocks(currentWrapper, maxWrapper);
  }

  public setResultBlocks(blocks: ResultBlocks) {
    this.uiManagerResult.setBlocks(blocks);
  }

  public setResult(result: string, score: number) {
    this.uiManagerResult.updateResult(result, score);
  }

  public playMusic() {
    this.uiManagerMenu.playMusic();
  }
}

class UIManagerMenu {
  private audioManager: AudioManager;
  private menuButtons: Array<HTMLElement> = [];
  private activeIndex = 0;
  private activeClass = 'is-active';

  constructor() {
    this.initAudioManager();
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

  public playMusic() {
    this.audioManager.musicPlay('menu');
  }

  private initAudioManager() {
    const musicList = [
      { name: 'menu', file: 'menu.mp3', loop: true },
      { name: 'button', file: 'button.mp3', loop: false },
      { name: 'enter', file: 'enter.mp3', loop: false }
    ];

    this.audioManager = new AudioManager();
    this.audioManager.addMusicList(musicList);
    this.playMusic();
  }

  private changeActiveClassMenuButtons(direction: string) {
    if (direction === 'up') {
      this.activeIndex =
        this.activeIndex === 0
          ? this.menuButtons.length - 1
          : this.activeIndex - 1;
    } else {
      this.activeIndex =
        this.activeIndex === this.menuButtons.length - 1
          ? 0
          : this.activeIndex + 1;
    }

    this.audioManager.musicPlay('button');

    this.menuButtons.forEach((button, index) => {
      const method = index === this.activeIndex ? 'add' : 'remove';

      button.classList[method](this.activeClass);
    });
  }

  private subscribes() {
    mediator.subscribe('keyboard:ArrowUp', () => {
      if (GameManager.stage !== 'menu') {
        return;
      }

      this.changeActiveClassMenuButtons('up');
    });

    mediator.subscribe('keyboard:ArrowDown', () => {
      if (GameManager.stage !== 'menu') {
        return;
      }

      this.changeActiveClassMenuButtons('down');
    });

    mediator.subscribe('keyboard:Enter', () => {
      if (GameManager.stage !== 'menu') {
        return;
      }

      this.audioManager.musicStop('menu');
      this.audioManager.musicPlay('enter');
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
    mediator.subscribe('store:update', (obj: GameScore) => {
      if (GameManager.stage === 'menu') {
        return;
      }

      const { current, max } = obj;

      this.current.innerText = Utils.getFilledZeroText(current.toString());
      this.max.innerText = Utils.getFilledZeroText(max.toString());
    });
  }
}

class UIManagerResult {
  private audioManager: AudioManager;
  private textWrapper: HTMLElement;
  private scoreWrapper: HTMLElement;
  private buttons: Array<ResultBlocksButton>;
  private activeIndex = 0;
  private activeClass = 'is-active';

  constructor() {
    this.initAudioManager();
    this.subscribes();
  }

  public setBlocks(blocks: ResultBlocks) {
    this.textWrapper = blocks.textWrapper;
    this.scoreWrapper = blocks.scoreWrapper;
    this.buttons = blocks.buttons;

    if (this.buttons.length) {
      this.buttons[this.activeIndex].element.classList.add('is-active');
    }
  }

  public updateResult(result: string, score: number) {
    this.textWrapper.innerText = result === 'win' ? 'YOU WIN!' : 'GAME OVER';
    this.scoreWrapper.innerText = Utils.getFilledZeroText(score.toString());
  }

  private initAudioManager() {
    const musicList = [
      { name: 'button', file: 'button.mp3', loop: false },
      { name: 'enter', file: 'enter.mp3', loop: false }
    ];

    this.audioManager = new AudioManager();
    this.audioManager.addMusicList(musicList);
  }

  private changeActiveClassMenuButtons(direction: string) {
    if (direction === 'up') {
      this.activeIndex =
        this.activeIndex === 0
          ? this.buttons.length - 1
          : this.activeIndex - 1;
    } else {
      this.activeIndex =
        this.activeIndex === this.buttons.length - 1
          ? 0
          : this.activeIndex + 1;
    }

    this.audioManager.musicPlay('button');

    this.buttons.forEach((button, index) => {
      const method = index === this.activeIndex ? 'add' : 'remove';

      button.element.classList[method](this.activeClass);
    });
  }

  private subscribes() {
    mediator.subscribe('keyboard:ArrowUp', () => {
      if (GameManager.stage === 'win' || GameManager.stage === 'lose') {
        this.changeActiveClassMenuButtons('up');
      }
    });

    mediator.subscribe('keyboard:ArrowDown', () => {
      if (GameManager.stage === 'win' || GameManager.stage === 'lose') {
        this.changeActiveClassMenuButtons('down');
      }
    });

    mediator.subscribe('keyboard:Enter', () => {
      if (GameManager.stage === 'win' || GameManager.stage === 'lose') {
        const eventName = this.buttons[this.activeIndex].eventName;

        this.audioManager.musicPlay('enter');
        mediator.publish(`result:${eventName}`);
      }
    });
  }
}

export default UIManager;
