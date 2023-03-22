type blockName = 'game' | 'menu' | 'status' | 'score';

interface InterfaceBlock {
  name: blockName,
  element: HTMLElement
}

class VisibilityManager {
  private static instance: VisibilityManager;
  private blocks: Array<InterfaceBlock>;
  private visibilityClass = 'is-active';

  public static getInstance(): VisibilityManager {
    if (!VisibilityManager.instance) {
      VisibilityManager.instance = new VisibilityManager();
    }

    return VisibilityManager.instance;
  }

  public setBlocks(blocks: Array<InterfaceBlock>) {
    this.blocks = blocks;
  }

  public hideBlocks(names: Array<blockName>) {
    names.forEach((name) => {
      const block = this.blocks.find((item) => item.name === name);

      if (!block) {
        return;
      }

      block.element.classList.remove(this.visibilityClass);
    });
  }

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
