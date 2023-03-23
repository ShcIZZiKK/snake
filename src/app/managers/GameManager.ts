import InputManager from './InputManager';
import UIManager from './UIManager';
import VisibilityManager from './VisibilityManager';
import Mediator from '../helpers/Mediator';
import { GameObject, InterfaceBlock } from '../interfaces';
import { stage } from '../types';

const mediator = new Mediator();

class GameManager {
  private static instance: GameManager;
  public static stage: stage = 'menu';
  private visibilityManager: VisibilityManager;
  private uiManager: UIManager;
  private activeGame: GameObject;
  private gamesList: Array<GameObject>;

  private gameWrapper: HTMLElement;
  private menuWrapper: HTMLElement;
  private statusWrapper: HTMLElement;
  private scoreWrapper: HTMLElement;
  private scoreCurrentWrapper: HTMLElement;
  private scoreMaxWrapper: HTMLElement;

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }

    return GameManager.instance;
  }

  public init() {
    this.getElements();
    this.subscribes();
    this.initUIManager();
    this.initVisibilityManager();
    this.initInputManager();
  }

  public setGamesList(games: Array<GameObject>) {
    this.gamesList = games;
  }

  public updateStage(stage: stage) {
    GameManager.stage = stage;

    switch (GameManager.stage) {
      case 'menu':
        this.visibilityManager.hideBlocks(['game', 'status', 'score']);
        this.visibilityManager.showBlocks(['menu']);
        break;
      case 'game':
        this.visibilityManager.hideBlocks(['menu']);
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
  }

  private initUIManager() {
    const buttons = this.gamesList.map((item) => item.name);

    this.uiManager = UIManager.getInstance();
    this.uiManager.setMenuItems(this.menuWrapper, buttons);
    this.uiManager.setScoreItems(this.scoreCurrentWrapper, this.scoreMaxWrapper);
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

  private initInputManager() {
    InputManager.getInstance();
  }

  private subscribes() {
    mediator.subscribe('menu:enter', (index: number) => {
      const { game } = this.gamesList[index];

      this.updateStage('game');

      game.init();
      game.start();
    });
  }
}

export default GameManager;
