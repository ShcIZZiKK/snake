import GameManager from './managers/GameManager';

// Games
import GameSnake from './games/snake/Game';

const gameSnake = new GameSnake();

const games = [
  {
    name: 'snake',
    game: gameSnake,
  },
  {
    name: '2048',
    game: null,
  },
  {
    name: 'arkanoid',
    game: null,
  },
];

const gameManager = GameManager.getInstance();

gameManager.setGamesList(games);
gameManager.init();
