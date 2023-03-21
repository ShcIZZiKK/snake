class AudioManager {
  static dir = 'assets/audio/';

  static audioMusic = null;

  static audioSounds = null;

  static init() {
    if (!this.audioMusic || !this.audioSounds) {
      this.audioMusic = AudioManager.createAudioManager(true);
      this.audioSounds = AudioManager.createAudioManager();
    }
  }

  static createAudioManager(loop) {
    const manager = new Audio();

    if (loop) {
      manager.loop = true;
    }

    return manager;
  }

  static changeMusicSource(name) {
    this.audioMusic.src = `${this.dir}${name}`;
  }

  static musicPlay() {
    this.audioMusic.play();
  }

  static musicPause() {
    this.audioMusic.pause();
  }

  static changeSoundSource(name) {
    this.audioSounds.src = `${this.dir}${name}`;
  }

  static soundPlay() {
    this.audioSounds.play();
  }
}

export default AudioManager;
