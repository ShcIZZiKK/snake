import { blockName } from '../types';

export interface GameObject {
  name: string;
  game: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
