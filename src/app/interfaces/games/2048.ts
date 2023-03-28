export interface Position {
  x: number;
  y: number;
}

export interface BoardCell {
  value: number;
  isStacked: boolean;
  canMove: boolean;
  x: number;
  y: number;
  id: number;
}

export interface TileOptions {
  context: CanvasRenderingContext2D;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  padding: number;
}

export interface BackgroundOptions {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  padding: number;
  size: number;
  color?: string;
}
