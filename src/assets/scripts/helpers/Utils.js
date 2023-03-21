class Utils {
    /**
     * Генератор случайных чисел в заданном диапазоне
     * @param min
     * @param max
     * @return {*}
     */
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

export default Utils;
