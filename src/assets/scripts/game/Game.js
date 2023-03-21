import Snake from './Snake';
import Food from "./Food";
import Mediator from '../helpers/Mediator';

const mediator = new Mediator();

class Game {
    constructor() {
        /**
         * Поле, на котором всё будет происходить, — тоже как бы переменная
         */
        this.canvas = null;

        /**
         * Классическая змейка — двухмерная, сделаем такую же
         */
        this.context = null;

        /**
         * Размер одной клеточки на поле — 16 пикселей
         * @type {number}
         */
        this.grid = 16;

        this.count = 0;

        this.snake = null;
    }

    init() {
        this.#initElements();
        this.#bindEvents();
        this.#subscribes();
    }

    start() {
        requestAnimationFrame(this.loop);
    }

    loop() {
        // Хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15 (60/15 = 4)
        requestAnimationFrame(this.loop);
        // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров,
        // а пока переменная count меньше четырёх, код выполняться не будет
        if (++this.count < 20) {
            return;
        }
        // Обнуляем переменную скорости
        this.count = 0;
        // Очищаем игровое поле
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Двигаем змейку с нужной скоростью
        this.snake.changePosition();

        // Рисуем еду
        this.food.drawFood();

        // Получаем координаты еды
        const { x: foodX, y: foodY } = this.food.getPosition();

        // Рисуем змею
        this.snake.drawSnake({
            x: foodX,
            y: foodY
        });
    }

    #initElements() {
        this.canvas = document.getElementById('game');
        this.context = canvas.getContext('2d');
        this.snake = new Snake({
            canvas: this.canvas,
            context: this.context,
            grid: this.grid,
            color: 'green'
        });
        this.food = new Food({
            context: this.context,
            grid: this.grid,
            color: 'red'
        })
    }

    #bindEvents() {
        /**
         * Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
         */
        document.addEventListener('keydown', (event) => {
            const { dx, dy } = this.snake.getDirection();

            switch (true) {
                // Стрелка влево
                case event.which === 37 && dx === 0:
                    this.snake.setDirection(-this.grid, 0);

                    break;
                // Стрелка вверх
                case event.which === 38 && dy === 0:
                    this.snake.setDirection(0, -this.grid);

                    break;
                // Стрелка вправо
                case event.which === 39 && dx === 0:
                    this.snake.setDirection(this.grid, 0);

                    break;
                // Стрелка вниз
                case event.which === 40 && dy === 0:
                    this.snake.setDirection(0, this.grid);

                    break;
            }
        });
    }

    #subscribes() {
        mediator.subscribe('food:eat', () => {
            this.food.setRandomPosition();
        });

        mediator.subscribe('snake:dead', () => {
            this.snake.restart();
            this.food.setRandomPosition();
        });
    }
}

export default Game;
