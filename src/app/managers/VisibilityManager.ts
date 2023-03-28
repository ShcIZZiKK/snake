import { InterfaceBlock } from '../interfaces';
import { blockName } from '../types';

class VisibilityManager {
  private static instance: VisibilityManager; // Экземпляр класса
  private blocks: Array<InterfaceBlock>; // Список блоков которые скрываем/показываем
  private visibilityClass = 'is-active'; // Класс добавляемый блоку для видимости

  /**
   * Доступом к экземпляру
   */
  public static getInstance(): VisibilityManager {
    if (!VisibilityManager.instance) {
      VisibilityManager.instance = new VisibilityManager();
    }

    return VisibilityManager.instance;
  }

  /**
   * Устанавливает список блоков с которыми будет взаимодействовать класс
   * @param blocks
   */
  public setBlocks(blocks: Array<InterfaceBlock>) {
    this.blocks = blocks;
  }

  /**
   * Скрывает блоки
   * @param names - список блоков которые скрываем
   */
  public hideBlocks(names: Array<blockName>) {
    names.forEach((name) => {
      const block = this.blocks.find((item) => item.name === name);

      if (!block) {
        return;
      }

      block.element.classList.remove(this.visibilityClass);
    });
  }

  /**
   * Показывает блоки
   * @param names - список блоков которые показываем
   */
  public showBlocks(names: Array<blockName>) {
    names.forEach((name) => {
      const block = this.blocks.find((item) => item.name === name);

      if (!block) {
        return;
      }

      block.element.classList.add(this.visibilityClass);
    });
  }
}

export default VisibilityManager;
