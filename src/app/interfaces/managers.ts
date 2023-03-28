import DefaultGame from '../abstracts/DefaultGame';
import { blockName } from '../types';

export interface GameObject {
  name: string;
  game: DefaultGame;
  helper?: Array<HelperList>;
}

export interface InterfaceBlock {
  name: blockName;
  element: HTMLElement;
}

export interface GameScore {
  current: number;
  max: number;
}

export interface Sound {
  name: string;
  file: string;
  loop: boolean;
  volume?: number;
  manager?: HTMLAudioElement;
}

export interface ResultBlocksButton {
  eventName: string;
  element: HTMLElement;
}

export interface ResultBlocks {
  textWrapper: HTMLElement;
  scoreWrapper: HTMLElement;
  buttons: Array<ResultBlocksButton>;
}

export interface HelperList {
  key: string;
  description: string;
}
