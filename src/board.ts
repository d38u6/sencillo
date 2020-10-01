import { ImageJS } from "./ImageJS/ImageJS";
import { MousePosition, Resolution } from "./commonTypes";
import { Puzzle } from "./puzzle";

export interface BoardOptions extends Resolution {
  gridSize: number;
}

export class Board {
  private readonly puzzleWidth: number;

  private readonly puzzleHeight: number;

  private readonly gridSize: number;

  private puzzles: Puzzle[];

  constructor(
    private readonly image: ImageJS,
    { width, height, gridSize }: BoardOptions
  ) {
    this.puzzleWidth = width / gridSize;
    this.puzzleHeight = height / gridSize;
    this.gridSize = gridSize;

    this.puzzles = [...this.createPuzzles()];
  }

  *createPuzzles(): Generator<Puzzle> {
    const { puzzleWidth, puzzleHeight, gridSize } = this;
    for (let x = 0; x < gridSize; x += 1) {
      for (let y = 0; y < gridSize; y += 1) {
        const posX = x * puzzleWidth;
        const posY = y * puzzleHeight;
        yield new Puzzle(
          this.image.cut(posX, posY, puzzleWidth, puzzleHeight),
          { posX, posY, gridX: x, gridY: y }
        );
      }
    }
  }

  handlerMouseMove = (mousePosition: MousePosition): void => {
    this.puzzles.forEach((p) => p.handlerMouseMove(mousePosition));
  };

  draw(ctx: CanvasRenderingContext2D): void {
    this.puzzles.forEach((puzzle) => puzzle.draw(ctx));
  }
}
