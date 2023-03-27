import UIManager from './UIManager';
import VisibilityManager from './VisibilityManager';
import Mediator from '../helpers/Mediator';
import { GameObject, InterfaceBlock, ResultBlocksButton } from '../interfaces';
import { stage } from '../types';

const mediator = new Mediator();

class GameManager {
  private static instance: GameManager;
  public static stage: stage = 'menu';
  private visibilityManager: VisibilityManager;
  private uiManager: UIManager;
  private activeGame: GameObject;
  private readonly gamesList: Array<GameObject>;

  private gameWrapper: HTMLElement;
  private menuWrapper: HTMLElement;
  private statusWrapper: HTMLElement;
  private scoreWrapper: HTMLElement;
  private scoreCurrentWrapper: HTMLElement;
  private scoreMaxWrapper: HTMLElement;
  private resultTextWrapper: HTMLElement;
  private resultScoreWrapper: HTMLElement;
  private resultButtonRestart: HTMLElement;
  private resultButtonExit: HTMLElement;

  public static init(games: Array<GameObject>) {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager(games);
    }
  }

  private constructor(games: Array<GameObject>) {
    this.gamesList = games;

    this.getElements();
    this.subscribes();
    this.initUIManager();
    this.initVisibilityManager();
  }

  public updateStage(stage: stage) {
    GameManager.stage = stage;

    switch (GameManager.stage) {
      case 'menu':
        this.visibilityManager.hideBlocks(['game', 'status', 'score']);
        this.visibilityManager.showBlocks(['menu']);
        break;
      case 'game':
        this.visibilityManager.hideBlocks(['menu', 'status']);
        this.visibilityManager.showBlocks(['game', 'score']);
        break;
      case 'win':
      case 'lose':
        this.visibilityManager.showBlocks(['status']);
        break;
      default:
        break;
    }
  }

  private getElements() {
    this.gameWrapper = document.getElementById('game');
    this.menuWrapper = document.getElementById('game-menu');
    this.statusWrapper = document.getElementById('game-status');
    this.scoreWrapper = document.getElementById('game-score');
    this.scoreCurrentWrapper = document.getElementById('game-score-current');
    this.scoreMaxWrapper = document.getElementById('game-score-max');
    this.resultTextWrapper = document.getElementById('game-status-text');
    this.resultScoreWrapper = document.getElementById('game-status-score');
    this.resultButtonRestart = document.getElementById('game-status-restart');
    this.resultButtonExit = document.getElementById('game-status-exit');
  }

  private initUIManager() {
    const buttons = this.gamesList.map((item) => item.name);
    const buttonsResult: Array<ResultBlocksButton> = [
      { eventName: 'restart', element: this.resultButtonRestart },
      { eventName: 'exit', element: this.resultButtonExit }
    ];

    this.uiManager = UIManager.getInstance();
    this.uiManager.setMenuItems(this.menuWrapper, buttons);
    this.uiManager.setScoreItems(this.scoreCurrentWrapper, this.scoreMaxWrapper);
    this.uiManager.setResultBlocks({
      textWrapper: this.resultTextWrapper,
      scoreWrapper: this.resultScoreWrapper,
      buttons: buttonsResult
    });
  }

  private initVisibilityManager() {
    const blocks: Array<InterfaceBlock> = [
      { name: 'game', element: this.gameWrapper },
      { name: 'menu', element: this.menuWrapper },
      { name: 'status', element: this.statusWrapper },
      { name: 'score', element: this.scoreWrapper }
    ];

    this.visibilityManager = VisibilityManager.getInstance();
    this.visibilityManager.setBlocks(blocks);
  }

  private subscribes() {
    mediator.subscribe('menu:enter', (index: number) => {
      this.activeGame = this.gamesList[index];

      if (!this.activeGame?.game) {
        return;
      }

      this.updateStage('game');
      this.activeGame.game.init();
    });

    mediator.subscribe('game:lose', (score: number) => {
      this.updateStage('lose');
      this.uiManager.setResult('lose', score);
    });

    mediator.subscribe('game:win', (score: number) => {
      this.updateStage('win');
      this.uiManager.setResult('win', score);
    });

    mediator.subscribe('result:restart', () => {
      this.updateStage('game');
      this.activeGame.game.restart();
    });

    mediator.subscribe('result:exit', () => {
      this.updateStage('menu');
      this.uiManager.playMusic();
    });
  }
}

export default GameManager;
