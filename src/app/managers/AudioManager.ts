import { Sound } from '../interfaces';

class AudioManager {
  private dir = 'assets/audio/'; // Директория от куда берутся звуки
  private sounds: Array<Sound> = []; // Массив музыки

  /**
   * Добавляет музуку в менеджер
   * @param sounds
   */
  public addMusicList(sounds: Array<Sound>) {
    sounds.forEach((item: Sound) => {
      const findSound = this.sounds.find((sound) => sound.name === item.name);

      if (findSound) {
        return;
      }

      item.manager = this.createAudioManager(item.file, item.loop, item.volume);
    });

    this.sounds = [...this.sounds, ...sounds];
  }

  /**
   * Запускает определённую музыку по имени
   * @param name
   */
  public musicPlay(name: string) {
    const musicObject = this.findMusic(name);

    if (!musicObject) {
      return;
    }

    musicObject.manager.play();
  }

  /**
   * Останавливает определённую музыку по имени
   * @param name
   */
  public musicStop(name: string) {
    const musicObject = this.findMusic(name);

    if (!musicObject) {
      return;
    }

    musicObject.manager.pause();
    musicObject.manager.currentTime = 0;
  }

  /**
   * Ищет определённую музыку по имени
   * @param name
   */
  private findMusic(name: string) {
    return this.sounds.find((item) => item.name === name);
  }

  /**
   * Создаёт HTMLAudioElement
   * @param file
   * @param loop
   * @param volume
   * @private
   */
  private createAudioManager(file: string, loop: boolean, volume: number) {
    const manager = new Audio();

    manager.src = `${this.dir}${file}`;

    if (loop) {
      manager.loop = true;
    }

    if (volume) {
      manager.volume = 0.3;
    }

    return manager;
  }
}

export default AudioManager;
