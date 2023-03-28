export interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  lives: number;
  color: string;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export interface BallOptions {
  context: CanvasRenderingContext2D;
  callbackLose: (status: string) => void;
  canvasSize: CanvasSize;
  color?: string
}

export interface PlatformOptions {
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  color?: string
}
