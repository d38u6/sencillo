import { MousePosition } from "./commonTypes";
import { Puzzle } from "./puzzle";

type PuzzlesFactory = () => Puzzle[];

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

  private emptyPuzzle: Puzzle | undefined;

  constructor(
    puzzles: PuzzlesFactory,
    { puzzleWidth, puzzleHeight, gridSize }: BoardOptions
  ) {
    this.puzzleWidth = puzzleWidth;
    this.puzzleHeight = puzzleHeight;
    this.gridSize = gridSize;

    this.puzzles = puzzles();
    this.emptyPuzzle = this.puzzles.find(({ isEmpty }) => isEmpty);
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

  isMovePossible({ gridPosition, isEmpty }: Puzzle): boolean {
    if (this.emptyPuzzle && !isEmpty) {
      const { x, y } = this.emptyPuzzle.gridPosition;
      return (
        (Math.abs(x - gridPosition.x) < 2 && y === gridPosition.y) ||
        (Math.abs(y - gridPosition.y) < 2 && x === gridPosition.x)
      );
    }
    return false;
  }

  checkWin(): boolean {
    for (let i = 0; i < this.puzzles.length; i += 1) {
      if (!this.puzzles[i].isRightPlace()) return false;
    }
    return true;
  }

  handlerMouseMove = (mousePosition: MousePosition): void => {
    const resolvedPuzzel = this.puzzleResolver(mousePosition);
    if (
      resolvedPuzzel &&
      this.isMovePossible(resolvedPuzzel) &&
      resolvedPuzzel !== this.activePuzzle
    ) {
      this.activePuzzle?.blur();
      this.activePuzzle = resolvedPuzzel;
      this.activePuzzle.focus();
    } else if (!resolvedPuzzel) {
      this.activePuzzle?.blur();
      this.activePuzzle = null;
    }
  };

  handlerClick = (mousePosition: MousePosition): void => {
    if (this.emptyPuzzle) {
      const resolvedPuzzel = this.puzzleResolver(mousePosition);
      if (resolvedPuzzel && this.isMovePossible(resolvedPuzzel)) {
        const emptyGirdPos = { ...this.emptyPuzzle.gridPosition };
        const resolvedGridPos = { ...resolvedPuzzel.gridPosition };
        resolvedPuzzel.moveTo(emptyGirdPos);
        this.emptyPuzzle.moveTo(resolvedGridPos);
        resolvedPuzzel.blur();
        console.log(this.checkWin());
      }
    }
  };

  draw(ctx: CanvasRenderingContext2D): void {
    this.puzzles.forEach((puzzle) => puzzle.draw(ctx));
  }
}
