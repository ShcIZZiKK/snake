class Utils {
  /**
     * Генератор случайных чисел в заданном диапазоне
     * @param min
     * @param max
     * @return {*}
     */
  static getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static getFilledZeroText(text = '') {
    const defaultString = '000000';
    const size = text.length;
    const max = defaultString.length;

    return `${defaultString.substring(0, max - size)}${text}`;
  }
}

export default Utils;
