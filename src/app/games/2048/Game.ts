// Helpers
import DefaultGame from '../../abstracts/DefaultGame';
import Mediator from '../../helpers/Mediator';

// Game elements
import Tile from './Tile';
import Background from './Background';

// Interfaces
import { BoardCell } from '../../interfaces/games/2048';
type board = Array<Array<BoardCell>>;

// Custom
const mediator = Mediator.getInstance();

class Game extends DefaultGame {
  tiles: Array<Tile> = []; // Список плиток
  background: Background; // Фон
  size = 4; // Размер игрового поля size * size
  board: board = []; // Ячейки игрового поля
  isAnimated = false; // Происходит ли сейчас анимация
  isShowNewCell = false; // Происходит ли сейчас вывод новой ячейки
  tileWidth = 105; // Ширина плитки
  tileHeight = 105; // Высота плитки
  tilePadding = 4; // Расстояние между плитками плитки

  /**
   * Останавливает игру
   */
  stop() {
    super.stop();
    this.audioManager.musicStop('snake');
  }

  /**
   * Логика игры
   */
  update() {
    super.update();

    this.draw();
  }

  /**
   * Отрисовка игры
   */
  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.background.draw();

    const cells = this.board.flat();

    for (let i = 0; i < cells.length; i++) {
      const tile = this.tiles.find((item) => item.id === cells[i].id);

      if (cells[i].value) {
        if (tile.x !== cells[i].x || tile.y !== cells[i].y) {
          tile.changePosition({
            x: cells[i].x,
            y: cells[i].y
          });
        }
      }

      tile.draw(cells[i].value);
    }

    const hasAnimatedTile = this.tiles.find((tile) => tile.isAnimated);

    this.isAnimated = !!hasAnimatedTile;
  }

  /**
   * Инициализация менеджеров
   */
  initManagers() {
    super.initManagers('2048');

    const musicList = [
      { name: 'snake', file: 'snake.mp3', loop: true, volume: 0.3 },
      { name: 'food', file: 'food.mp3', loop: false },
      { name: 'lose', file: 'lose.mp3', loop: false }
    ];

    this.audioManager.addMusicList(musicList);
  }

  /**
   * Инициализация элементов игры
   */
  initElements() {
    super.initElements();

    const backgroundOptions = {
      context: this.context,
      width: this.tileWidth,
      height: this.tileHeight,
      padding: this.tilePadding,
      size: this.size
    }

    this.background = new Background(backgroundOptions);
  }

  /**
   * Устанавливает значения по умолчанию
   */
  setDefaultValues() {
    super.setDefaultValues();

    this.board = this.getEmptyBoard();
    this.generateRandom();
    this.generateRandom();

    this.tiles = [];
    this.fillTilesList();

    this.audioManager.musicPlay('snake');
  }

  /**
   * Выполняет действия при подебе/проигрыше
   */
  changeStatusGame(status: string) {
    super.changeStatusGame(status, 'ark');
  }

  /**
   * Обработчик событий нажатия кнопок
   * @param event
   */
  eventsKeyDown(event?: KeyboardEvent) {
    if (event.code === 'Escape') {
      mediator.publish('game:exit');
    }

    if (this.isAnimated || this.gameOver || this.isShowNewCell) {
      return;
    }

    switch (event.code) {
      case 'ArrowLeft':
        this.actionAfterMove(this.moveLeft(this.board));

        break;
      case 'ArrowUp':
        this.actionAfterMove(this.moveUp(this.board));

        break;
      case 'ArrowRight':
        this.actionAfterMove(this.moveRight(this.board));

        break;
      case 'ArrowDown':
        this.actionAfterMove(this.moveDown(this.board));

        break;
      default:
        break;
    }
  }

  /**
   * Действия после сдвига таблицы
   */
  private actionAfterMove(newBoard: board) {
    // Если после нажатия кнопки, сдвига не было ничего не делаем
    if (!this.hasDiff(this.board, newBoard)) {
      return;
    }

    this.board = newBoard;

    // Добавляем очки за стакнутые ячейки
    this.addScore(this.board);

    // Проверяем не победил ли пользователь
    if (this.isWin()) {
      this.changeStatusGame('win');

      return;
    }

    // Ставим флаг, что добавляется новая плитка на доску
    this.isShowNewCell = true;

    // Через заданный промежуток времени выводим плитку
    setTimeout(() => {
      this.generateRandom();
      this.isShowNewCell = false;

      // Проверяем не проигранна ли игра
      if (this.isLose()) {
        this.changeStatusGame('lose');
      }
    }, 150);
  }

  /**
   * Проверяем не проиграл ли пользователь
   * @private
   */
  private isLose() {
    // Если есть отличие, значит игра не проигранна
    if (this.hasDiff(this.board, this.moveLeft(this.board))) {
      return false;
    }

    if (this.hasDiff(this.board, this.moveRight(this.board))) {
      return false;
    }

    if (this.hasDiff(this.board, this.moveUp(this.board))) {
      return false;
    }

    if (this.hasDiff(this.board, this.moveDown(this.board))) {
      return false;
    }

    // Если отличий нет, игра проигранна
    return true;
  }

  /**
   * Проверяет, есть ли отличие у текущей доски, и у сдвинутой
   * @param board
   * @param newBoard
   * @private
   */
  private hasDiff(board: board, newBoard: board) {
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (board[row][column].value !== newBoard[row][column].value) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Возвращает доску смещённую влево
   * @private
   */
  private moveLeft(board: board): board {
    return this.move(board);
  }

  /**
   * Возвращает доску смещённую вправа
   * @private
   */
  private moveRight(board: board): board {
    // Отражаем доску, чтобы правая сторона стала левой
    const reverseBoard = this.reverse(board);
    // Смещаем доску влево
    const newBoard = this.moveLeft(reverseBoard);
    // Отражаем обратно и возвращаем
    return this.reverse(newBoard);
  }

  /**
   * Возвращает доску смещённую вверх
   * @private
   */
  private moveUp(board: board): board {
    // Поворачиваем доску на -90 градусов, чтобы верх доски стал левой стороной
    const rotateBoard = this.rotate90deg(board, -1);
    // Смещаем доску влево
    const newBoard = this.moveLeft(rotateBoard);
    // Поворачиваем обратно и возвращаем
    return this.rotate90deg(newBoard,1);
  }

  /**
   * Возвращает доску смещённую вниз
   * @private
   */
  private moveDown(board: board): board {
    // Поворачиваем доску на 90 градусов, чтобы низ доски стал левой стороной
    const rotateBoard = this.rotate90deg(board, 1);
    // Смещаем доску влево
    const newBoard = this.moveLeft(rotateBoard);
    // Поворачиваем обратно и возвращаем
    return this.rotate90deg(newBoard,-1);
  }

  /**
   * Формируем пустую доску
   * @private
   */
  private getEmptyBoard() {
    const newBoard = [];
    let id = 0;

    for (let row = 0; row < this.size; row++) {
      const newRow = [];

      for (let column = 0; column < this.size; column++) {
        newRow.push({
          value: 0,
          isStacked: false,
          canMove: true,
          x: column,
          y: row,
          id
        });

        id++;
      }

      newBoard.push(newRow);
    }

    return newBoard;
  }

  /**
   * Наполняем массив плиток
   * @private
   */
  private fillTilesList() {
    const options = {
      context: this.context,
      width: this.tileWidth,
      height: this.tileHeight,
      padding: this.tilePadding
    }
    let id = 0;

    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        const tile = new Tile({
          ...options,
          id,
          x: column,
          y: row
        });

        this.tiles.push(tile);

        id++;
      }
    }
  }

  /**
   * Проверяем есть ли заданное число на доске
   * @param value
   */
  private hasValue(value: number) {
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.board[row][column].value === value) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Проверяем победил ли пользователь
   */
  private isWin() {
    return this.hasValue(2048);
  }

  /**
   * Проверяем заполнена ли вся доска числами
   */
  private isFull() {
    return !this.hasValue(0);
  }

  /**
   * Генерирует рандомное число "4" или "2"
   * и вставляет его в рандомное место на доске
   */
  private generateRandom() {
    if (this.isFull()) {
      return;
    }

    const randomValueArr = [2, 4];
    const randomValue = randomValueArr[Math.floor(Math.random() * randomValueArr.length)]
    let isFoundEmptyCell = false;

    while (!isFoundEmptyCell) {
      const randomRow = Math.floor(Math.random() * this.size);
      const randomCol = Math.floor(Math.random() * this.size);

      if (this.board[randomRow][randomCol].value === 0) {
        this.board[randomRow][randomCol].value = randomValue;
        isFoundEmptyCell = true;

        const tile = this.tiles.find((tile) => tile.id === this.board[randomRow][randomCol].id);

        if (tile) {
          tile.x = this.board[randomRow][randomCol].x;
          tile.y = this.board[randomRow][randomCol].y;
        }

        this.score += randomValue;
        this.storeManager.updateCurrentValue(this.score);
      }
    }
  }

  /**
   * Смещаяет все ячейки в линии влево
   * @param row
   * @private
   */
  private static mergeRow(row: Array<BoardCell>): Array<BoardCell> {
    for (let column = 0; column < row.length; column++) {
      // Если значение равно нулю, то не двигаем ячейку
      if (row[column].value === 0) {
        continue;
      }

      // Если значение прижато к краю, то оно не может двигаться
      if (column === 0) {
        row[column].canMove = false;

        continue;
      }

      // Если предыдущее ячейка пустая, то сдвигаем текущую ячейку на её позицию
      if (row[column - 1].value === 0) {
        row[column - 1].value = row[column].value;
        row[column].value = 0;

        const tempId = row[column].id;
        row[column].id = row[column - 1].id;
        row[column - 1].id = tempId;

        continue;
      }

      // Если предыдущая ячейка имеет значение равное текущей ячейке и значения
      // не были стакнуты, то скрещиваем ячейки
      if (row[column - 1].value === row[column].value && !row[column - 1].isStacked && !row[column].isStacked) {
        row[column - 1].value = row[column - 1].value * 2;
        row[column].value = 0;
        row[column - 1].isStacked = true;

        const tempId = row[column].id;
        row[column].id = row[column - 1].id;
        row[column - 1].id = tempId;

        continue;
      }

      /**
       * Иначе ячейка не может быть сдвинута
       */
      row[column].canMove = false;
    }

    // Получаем массив ячеек которые больше не могут двигаться
    const checkMoved = row.filter((columnItem) => {
      return columnItem.value === 0 || columnItem.isStacked || !columnItem.canMove;
    });

    // Если кол-во ячеек которые не могут двигаться, равно длине строки, то возвращаем эту строку
    if (checkMoved.length === row.length) {
      return row;
    }

    // Иначе повторно вызываем метод со сдвигом
    return Game.mergeRow(row);
  }

  /**
   * Двигает ячейки на доске
   * @param board
   * @private
   */
  private move(board: board) {
    const newBoard: board = JSON.parse(JSON.stringify(board));

    for (let row = 0; row < this.size; row++) {
      // Делаем все значения двигаемыми и не стакнутыми
      newBoard[row].forEach((columnItem) => {
        columnItem.canMove = true;
        columnItem.isStacked = false;
      });

      // Получаем новую строку
      newBoard[row] = Game.mergeRow(newBoard[row]);
    }

    return newBoard;
  }

  /**
   * Отражает доску по горизонтали доску
   * Например:
   * [[1, 2], [3, 4]] => [[2, 1], [4, 3]]
   * @param board
   * @private
   */
  private reverse(board: board): board {
    return board.map((row) => {
      const reverseRow: Array<BoardCell> = [];
      const length = row.length;

      for (let i = 0; i < length; i++) {
        reverseRow[i] = row[length - 1 - i];
      }

      return reverseRow;
    });
  }

  /**
   * Поворачивает доску на 90 градусов
   * @param board
   * @param direction - 1 - на 90 градусов вправо, -1 - на 90 градусов влево
   * @private
   */
  private rotate90deg(board: board, direction: number) {
    if (direction > 0) {
      return board[0].map((val, index) => board.map(row => row[index]).reverse());
    }

    return board[0].map((val, index) => board.map(row => row[row.length-1-index]));
  }

  /**
   * Добавляет очки за стакнутые ячейки
   * @param board
   * @private
   */
  private addScore(board: board) {
    const addScore = board.reduce((sum: number, row) => {
      return row.reduce((rowSum: number, rowAcc: BoardCell) => {
        if (rowAcc.isStacked) {
          rowSum += rowAcc.value;
        }

        return rowSum;
      }, 0);
    }, 0);

    if (addScore > 0) {
      this.score += addScore;
      this.storeManager.updateCurrentValue(this.score);
    }
  }
}

export default Game;
