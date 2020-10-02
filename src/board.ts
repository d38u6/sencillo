import { ImageJS } from "./ImageJS/ImageJS";
import { MousePosition, Resolution } from "./commonTypes";
import { Puzzle } from "./puzzle";

import imgEmptyPuzzle from "./assets/emptyPuzzle.png";

export interface BoardOptions extends Resolution {
  gridSize: number;
}

export class Board {
  private readonly puzzleWidth: number;

  private readonly puzzleHeight: number;

  private readonly gridSize: number;

  private puzzles: Puzzle[] = [];

  constructor(
    private readonly image: ImageJS,
    { width, height, gridSize }: BoardOptions
  ) {
    this.puzzleWidth = width / gridSize;
    this.puzzleHeight = height / gridSize;
    this.gridSize = gridSize;

    this.initPuzzles();
  }

  async initPuzzles(): Promise<void> {
    this.puzzles = [...this.createPuzzles()];
    this.puzzles.pop();
    const emptyPuzzle = await this.createEmptyPuzzle();
    this.puzzles.push(emptyPuzzle);
  }

  async createEmptyPuzzle(): Promise<Puzzle> {
    const { puzzleWidth, puzzleHeight, gridSize } = this;
    const lastIndex = gridSize - 1;
    const emptyPuzzle = (await ImageJS.createFromFile(imgEmptyPuzzle))
      .rescale({ width: puzzleWidth, height: puzzleHeight })
      .getSource();

    return new Puzzle(emptyPuzzle, {
      x: lastIndex * puzzleWidth,
      y: lastIndex * puzzleHeight,
    });
  }

  *createPuzzles(): Generator<Puzzle> {
    const { puzzleWidth, puzzleHeight, gridSize } = this;
    for (let x = 0; x < gridSize; x += 1) {
      for (let y = 0; y < gridSize; y += 1) {
        const posX = x * puzzleWidth;
        const posY = y * puzzleHeight;
        yield new Puzzle(
          this.image.cut(posX, posY, puzzleWidth, puzzleHeight),
          { x: posX, y: posY }
        );
      }
    }
  }

  handlerMouseMove = (mousePosition: MousePosition): void => {
    this.puzzles.forEach((p) => p.handlerMouseMove(mousePosition));
  };

  draw(ctx: CanvasRenderingContext2D): void {
    ImageJS.clearCanvas(ctx);
    this.puzzles.forEach((puzzle) => puzzle.draw(ctx));
  }
}
