import { Sounds, SoundsList } from '../interfaces';

class AudioManager {
  private static instance: AudioManager;
  private dir = 'assets/audio/';
  private currentSound: Sounds;
  private sounds: Array<Sounds> = [];

  public addMusicList(sound: Sounds) {
    const soundObject = this.sounds.find((item) => item.game === sound.game);

    if (soundObject) {
      this.setCurrentSound(soundObject);
    } else {
      sound.list.forEach((item: SoundsList) => {
        item.manager = this.createAudioManager(item.file, item.loop);
      });

      this.sounds.push(sound);
      this.setCurrentSound(this.sounds[this.sounds.length - 1]);
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }

    return AudioManager.instance;
  }

  public musicPlay(name: string) {
    const musicObject = this.currentSound.list.find((item) => item.name === name);

    if (!musicObject) {
      return;
    }

    musicObject.manager.play();
  }

  private setCurrentSound(sound: Sounds) {
    this.currentSound = sound;
  }

  private createAudioManager(file: string, loop: boolean) {
    const manager = new Audio();

    manager.src = `${this.dir}${file}`;

    if (loop) {
      manager.loop = true;
    }

    return manager;
  }
}

export default AudioManager;
