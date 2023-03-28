class Utils {
  /**
   * Генератор случайных чисел в заданном диапазоне
   * @param min - минимальное значение
   * @param max - максимальное значение
   */
  static getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Добавляет нули в начало текста, например 12 будет приобразованно в 000012
   * @param text - текст для преобразования
   */
  static getFilledZeroText(text = '') {
    const defaultString = '000000';
    const size = text.length;
    const max = defaultString.length;

    return `${defaultString.substring(0, max - size)}${text}`;
  }
}

export default Utils;
