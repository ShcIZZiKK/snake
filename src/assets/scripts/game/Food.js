import Utils from '../helpers/Utils';

class Food {
    constructor() {
        /**
         * Начальныя координата еды по X
         * @type {number}
         */
        this.x = 320;

        /**
         * Начальныя координата еды по Y
         * @type {number}
         */
        this.y = 320;

        this.colorDefault = 'red';
    }

    init(options) {
        this.context = options.context;
        this.grid = options.grid;
        this.color = options.color || this.colorDefault;
    }

    drawFood() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.grid - 1, this.grid - 1);
    }

    setRandomPosition() {
        // Рисуем новое яблочко
        // Помним, что размер холста у нас 400x400, при этом он разбит на ячейки — 25 в каждую сторону
        this.x = Utils.getRandomInt(0, 25) * this.grid;
        this.y = Utils.getRandomInt(0, 25) * this.grid;
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }
}

export default Food;
