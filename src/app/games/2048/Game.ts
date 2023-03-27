import DefaultGame from '../../abstracts/DefaultGame';
import AudioManager from '../../managers/AudioManager';
import StoreManager from '../../managers/StoreManager';
import Tile from './Tile';
import Background from './Background';

interface BoardCell {
  value: number;
  isStacked: boolean;
  canMove: boolean;
}

type board = Array<Array<BoardCell>>;

class Game extends DefaultGame{
  audioManager: AudioManager; // Аудио менеджер
  storeManager: StoreManager; // Хранилище очков
  canvas: HTMLCanvasElement; // Html элемент канваса
  context: CanvasRenderingContext2D; // Контекст канваса
  tile: Tile;
  background: Background;

  gameOver = false;
  size = 4;
  board: board = [];

  init() {
    this.initManagers();
    this.initElements();
    this.bindEvents();
    this.start();
  }

  start() {
    this.board = this.getEmptyBoard();
    this.generateRandom(this.board);
    this.generateRandom(this.board);
    requestAnimationFrame(this.update.bind(this));
  }

  stop() {
    console.log('stop');
  }

  restart() {
    console.log('restart');
  }

  update() {
    if (this.gameOver) {
      return;
    }

    requestAnimationFrame(this.update.bind(this));

    this.draw();
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw();

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        this.tile.draw(this.board[row][column].value, column, row);
      }
    }
  }

  loseGame() {
    console.log('loseGame');
  }

  winGame() {
    console.log('winGame');
  }

  private getEmptyBoard() {
    const newBoard = [];

    for (let row = 0; row < this.size; row++) {
      const newRow = [];
      for (let column = 0; column < this.size; column++) {
        newRow.push({
          value: 0,
          isStacked: false,
          canMove: true
        });
      }

      newBoard.push(newRow);
    }

    return newBoard;
  }

  private hasValue = (board: board, value: number) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j].value === value) {
          return true;
        }
      }
    }

    return false;
  };

  private isFull = (board: board) => {
    return !this.hasValue(board, 0);
  };

  private generateRandom(board: board) {
    if (this.isFull(board)) {
      return board;
    }

    const randomValueArr = [2, 4];
    const randomValue = randomValueArr[Math.floor(Math.random() * randomValueArr.length)]
    let isFoundEmptyCell = false;

    while (!isFoundEmptyCell) {
      const randomRow = Math.floor(Math.random() * this.size);
      const randomCol = Math.floor(Math.random() * this.size);

      if (board[randomRow][randomCol].value === 0) {
        board[randomRow][randomCol].value = randomValue;
        isFoundEmptyCell = true;
      }
    }

    return board;
  }

  private static mergeRow(row: Array<BoardCell>): Array<BoardCell> {
    for (let column = 0; column < row.length; column++) {
      /**
       * Если значение равно нулю, то не двигаем ячейку
       */
      if (row[column].value === 0) {
        continue;
      }

      /**
       * Если значение прижато к краю, то оно не может двигаться
       */
      if (column === 0) {
        row[column].canMove = false;

        continue;
      }

      /**
       * Если предыдущее ячейка пустая, то сдвигаем текущую ячейку на её позицию
       */
      if (row[column - 1].value === 0) {
        row[column - 1].value = row[column].value;
        row[column].value = 0;

        continue;
      }

      /**
       * Если предыдущая ячейка имеет значение равное текущей ячейке и значения
       * не были стакнуты, то скрещиваем ячейки
       */
      if (row[column - 1].value === row[column].value && !row[column - 1].isStacked && !row[column].isStacked) {
        row[column - 1].value = row[column - 1].value * 2;
        row[column].value = 0;
        row[column - 1].isStacked = true;

        continue;
      }

      /**
       * Иначе ячейка не может быть сдвинута
       */
      row[column].canMove = false;
    }

    const checkMoved = row.filter((columnItem) => {
      return columnItem.value === 0 || columnItem.isStacked || !columnItem.canMove;
    });

    if (checkMoved.length === row.length) {
      return row;
    }

    return this.mergeRow(row);
  }

  private move(board: board) {
    for (let row = 0; row < this.size; row++) {
      // Делаем все значения двигаемыми и не стакнутыми
      board[row].forEach((columnItem) => {
        columnItem.canMove = true;
        columnItem.isStacked = false;
      });

      // Получаем новую строку
      board[row] = Game.mergeRow(this.board[row]);
    }
  }

  private reverse(board: board): board {
    for (let row = 0; row < this.size; row++) {
      board[row].reverse();
    }

    return board;
  }

  private rotate90deg(board: board, direction: number) {
    if (direction > 0) {
      return board[0].map((val, index) => board.map(row => row[index]).reverse());
    }

    return board[0].map((val, index) => board.map(row => row[row.length-1-index]));
  }

  private initManagers() {
    const musicList = [
      { name: 'snake', file: 'snake.mp3', loop: true },
      { name: 'food', file: 'food.mp3', loop: false },
      { name: 'lose', file: 'lose.mp3', loop: false }
    ];

    this.audioManager = new AudioManager();
    this.audioManager.addMusicList(musicList);

    this.storeManager = new StoreManager('2048');
  }

  private initElements() {
    this.canvas = <HTMLCanvasElement>document.getElementById('game');
    this.context = this.canvas.getContext('2d');

    this.tile = new Tile(this.context);
    this.background = new Background(this.context);
  }

  private bindEvents() {
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowLeft':
          this.move(this.board);
          this.generateRandom(this.board);

          break;
        case 'ArrowUp':
          this.board = this.rotate90deg(this.board, -1);
          this.move(this.board);
          this.board = this.rotate90deg(this.board,1);
          this.generateRandom(this.board);

          break;
        case 'ArrowRight':
          this.reverse(this.board);
          this.move(this.board);
          this.reverse(this.board);
          this.generateRandom(this.board);

          break;
        case 'ArrowDown':
          this.board = this.rotate90deg(this.board, 1);
          this.move(this.board);
          this.board = this.rotate90deg(this.board,-1);
          this.generateRandom(this.board);

          break;
        default:
          break;
      }
    });
  }
}

export default Game;
