export type SquareNumber = 0 | 9 | 16 | 25 | 36 | 49 | 64;

export interface MousePosition {
  offsetX: number;
  offsetY: number;
}

export interface Resolution {
  width: number;
  height: number;
}

export type Position = {
  x: number;
  y: number;
};

export type Matrix = CanvasImageSource[][];

export interface Puzzle {
  position: Position;
  destiny: Position;
  source: CanvasImageSource;
}

export type Context2d =
  | OffscreenCanvasRenderingContext2D
  | CanvasRenderingContext2D;
