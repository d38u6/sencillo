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

  private activePuzzle: Puzzle | null = null;

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

  puzzleResolver({ offsetX, offsetY }: MousePosition): Puzzle | undefined {
    const marginW = 35;
    const marginH = 20;
    return this.puzzles.find(
      ({ coordinates: { x, y } }) =>
        offsetX > x + marginW &&
        offsetX < x + (this.puzzleWidth - marginW) &&
        offsetY > y + marginH &&
        offsetY < y + (this.puzzleHeight - marginH)
    );
  }

  handlerMouseMove = (mousePosition: MousePosition): void => {
    const resolvedPuzzel = this.puzzleResolver(mousePosition);
    if (resolvedPuzzel && resolvedPuzzel !== this.activePuzzle) {
      this.activePuzzle?.blur();
      this.activePuzzle = resolvedPuzzel;
      this.activePuzzle.focus();
    } else if (!resolvedPuzzel) {
      this.activePuzzle?.blur();
      this.activePuzzle = null;
    }
  };

  handlerClick = (mousePosition: MousePosition): void => {
    console.log(mousePosition);
  };

  draw(ctx: CanvasRenderingContext2D): void {
    this.puzzles.forEach((puzzle) => puzzle.draw(ctx));
  }
}
