export interface Cell {
  x: number;
  y: number;
}

export interface CanvasSize {
  width: number;
  height: number
}

export interface SnakeOptions {
  context: CanvasRenderingContext2D;
  grid: number;
  color: string;
  size: CanvasSize
}

export interface FoodOptions {
  context: CanvasRenderingContext2D;
  grid: number;
  color: string;
  size: CanvasSize
}
