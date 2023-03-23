import GameManager from './managers/GameManager';

// Games
import GameSnake from './games/snake/Game';
import GameArkanoid from './games/arkanoid/Game';

const gameSnake = new GameSnake();
const gameArkanoid = new GameArkanoid();

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
    game: gameArkanoid,
  },
];

const gameManager = GameManager.getInstance();

gameManager.setGamesList(games);

window.addEventListener('load', () => {
  gameManager.init();
});
