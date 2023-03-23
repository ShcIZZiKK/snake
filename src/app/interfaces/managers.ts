import { blockName } from '../types';

export interface GameObject {
  name: string,
  game: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface InterfaceBlock {
  name: blockName,
  element: HTMLElement
}

export interface GameScore {
  current: number;
  max: number;
}

export interface GameScoreStoreItem extends GameScore {
  name: string,
}

export interface SoundsList {
  name: string;
  file: string;
  loop: boolean,
  manager?: HTMLAudioElement
}

export interface Sounds {
  game: string;
  list: Array<SoundsList>
}
