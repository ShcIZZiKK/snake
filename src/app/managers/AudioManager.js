class AudioManager {
  constructor() {
    this.dir = 'assets/audio/';
    this.audioMusic = null;
    this.audioSounds = null;
  }

  init() {
    this.audioMusic = this.#createAudioManager(true);
    this.audioSounds = this.#createAudioManager();
  }

  #createAudioManager(loop) {
    const manager = new Audio();

    if (loop) {
      manager.loop = true;
    }

    return manager;
  }

  changeMusicSource(name) {
    this.audioMusic.src = `${this.dir}${name}`;
  }

  musicPlay() {
    this.audioMusic.play();
  }

  musicPause() {
    this.audioMusic.pause();
  }

  changeSoundSource(name) {
    this.audioSounds.src = `${this.dir}${name}`;
  }

  soundPlay() {
    this.audioSounds.play();
  }
}

export default AudioManager;
