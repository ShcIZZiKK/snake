import Mediator from '../helpers/Mediator';

const mediator = new Mediator();

class InputManager {
  private static instance: InputManager;
  private keyboardCodes: Array<string> = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Enter', 'Space'];

  public static getInstance(): InputManager {
    if (!InputManager.instance) {
      InputManager.instance = new InputManager();
    }

    return InputManager.instance;
  }

  private constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    /**
     * Смотрим, какие нажимаются клавиши, и собщаем об этом подписчикам
     */
    document.addEventListener('keydown', (event) => {
      if (!this.keyboardCodes.includes(event.code)) {
        return;
      }

      mediator.publish(`keyboard:${event.code}`);
    });
  }
}

export default InputManager;
