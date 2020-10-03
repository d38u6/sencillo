import { MousePosition } from "./commonTypes";
import { Puzzle } from "./puzzle";

type PuzzlesFactory = () => Promise<Puzzle[]>;

export interface BoardOptions {
  puzzleWidth: number;
  puzzleHeight: number;
  gridSize: number;
}

export class Board {
  private readonly puzzleWidth: number;

  private readonly puzzleHeight: number;

  private readonly gridSize: number;

  private puzzles: Puzzle[] = [];

  constructor(
    puzzles: PuzzlesFactory,
    { puzzleWidth, puzzleHeight, gridSize }: BoardOptions
  ) {
    this.puzzleWidth = puzzleWidth;
    this.puzzleHeight = puzzleHeight;
    this.gridSize = gridSize;

    this.initPuzzles(puzzles);
  }

  async initPuzzles(puzzles: PuzzlesFactory): Promise<void> {
    this.puzzles = await puzzles();
  }

  handlerMouseMove = (mousePosition: MousePosition): void => {
    // this.puzzles.forEach((p) => p.handlerMouseMove(mousePosition));
  };

  draw(ctx: CanvasRenderingContext2D): void {
    this.puzzles.forEach((puzzle) => puzzle.draw(ctx));
  }
}
