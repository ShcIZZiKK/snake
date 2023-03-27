import { Sound } from '../interfaces';

class AudioManager {
  private dir = 'assets/audio/';
  private sounds: Array<Sound> = [];

  public addMusicList(sounds: Array<Sound>) {
    sounds.forEach((item: Sound) => {
      item.manager = this.createAudioManager(item.file, item.loop);
    });

    this.sounds = sounds;
  }

  public musicPlay(name: string) {
    const musicObject = this.findMusic(name);

    if (!musicObject) {
      return;
    }

    musicObject.manager.play();
  }

  public musicStop(name: string) {
    const musicObject = this.findMusic(name);

    if (!musicObject) {
      return;
    }

    musicObject.manager.pause();
    musicObject.manager.currentTime = 0;
  }

  private findMusic(name: string) {
    return this.sounds.find((item) => item.name === name);
  }

  private createAudioManager(file: string, loop: boolean) {
    const manager = new Audio();

    manager.src = `${this.dir}${file}`;

    if (loop) {
      manager.loop = true;
      manager.volume = 0.3;
    }

    return manager;
  }
}

export default AudioManager;
