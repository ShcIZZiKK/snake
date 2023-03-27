import GameManager from './managers/GameManager';

// Games
import GameSnake from './games/snake/Game';
import GameArkanoid from './games/arkanoid/Game';
import Game2048 from './games/2048/Game';

const gameSnake = new GameSnake();
const gameArkanoid = new GameArkanoid();
const game2048 = new Game2048();

const games = [
  {
    name: 'snake',
    game: gameSnake,
  },
  {
    name: '2048',
    game: game2048,
  },
  {
    name: 'arkanoid',
    game: gameArkanoid,
  },
];

window.addEventListener('load', () => {
  GameManager.init(games);
});
