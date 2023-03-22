import Mediator from '../helpers/Mediator';

const mediator = new Mediator();

class InputManager {
  init() {
    this.#bindEvents();
  }

  #bindEvents() {
    /**
     * Смотрим, какие нажимаются клавиши, и собщаем об этом подписчикам
     */
    document.addEventListener('keydown', (event) => {
      switch (true) {
        // Стрелка влево
        case event.which === 37:
          mediator.publish('keyboard:left-arrow');

          break;
          // Стрелка вверх
        case event.which === 38:
          mediator.publish('keyboard:up-arrow');

          break;
          // Стрелка вправо
        case event.which === 39:
          mediator.publish('keyboard:right-arrow');

          break;
          // Стрелка вниз
        case event.which === 40:
          mediator.publish('keyboard:down-arrow');

          break;
          // Кнопка enter
        case event.which === 13:
          mediator.publish('keyboard:enter');

          break;
        default:
          break;
      }
    });
  }
}

export default InputManager;
