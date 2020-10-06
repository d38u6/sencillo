import { MousePosition } from "./commonTypes";
import { Puzzle } from "./puzzle";
import { randomBetween } from "./utility";

type PuzzlesFactory = () => Puzzle[];

export interface BoardOptions {
  puzzleWidth: number;
  puzzleHeight: number;
  gridSize: number;
}

export class Board {
  private readonly gridSize: number;

  private readonly puzzleWidth: number;

  private readonly puzzleHeight: number;

  private puzzles: Puzzle[] = [];

  private activePuzzle: Puzzle | null = null;

  private emptyPuzzle: Puzzle | undefined;

  constructor(
    puzzles: PuzzlesFactory,
    { puzzleWidth, puzzleHeight, gridSize }: BoardOptions
  ) {
    this.gridSize = gridSize;
    this.puzzleWidth = puzzleWidth;
    this.puzzleHeight = puzzleHeight;

    this.puzzles = puzzles();
    this.emptyPuzzle = this.puzzles.find(({ isEmpty }) => isEmpty);
  }

  mixPuzzles(): void {
    const usedPositions: string[] = [];
    this.puzzles.forEach((puzzle) => {
      let x: number;
      let y: number;
      do {
        x = randomBetween(0, this.gridSize);
        y = randomBetween(0, this.gridSize);
      } while (usedPositions.includes(`${x}${y}`));
      puzzle.moveTo({ x, y });
      usedPositions.push(`${x}${y}`);
    });
  }

  private puzzleResolver({
    offsetX,
    offsetY,
  }: MousePosition): Puzzle | undefined {
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

  private isMovePossible({ gridPosition, isEmpty }: Puzzle): boolean {
    if (this.emptyPuzzle && !isEmpty) {
      const { x, y } = this.emptyPuzzle.gridPosition;
      return (
        (Math.abs(x - gridPosition.x) < 2 && y === gridPosition.y) ||
        (Math.abs(y - gridPosition.y) < 2 && x === gridPosition.x)
      );
    }
    return false;
  }

  private checkWin(): boolean {
    for (let i = 0; i < this.puzzles.length; i += 1) {
      if (!this.puzzles[i].isRightPlace()) return false;
    }
    return true;
  }

  private movePuzzle(puzzle: Puzzle): void {
    const tempGridPosition = { ...puzzle.gridPosition };
    if (this.emptyPuzzle) {
      puzzle.moveTo({ ...this.emptyPuzzle.gridPosition });
      this.emptyPuzzle.moveTo({ ...tempGridPosition });
    }
  }

  private activatePuzzle(puzzle: Puzzle): void {
    if (puzzle !== this.activePuzzle) {
      this.activePuzzle?.blur();
      this.activePuzzle = puzzle;
      this.activePuzzle.focus();
    }
  }

  private deactivatePuzzle(): void {
    this.activePuzzle?.blur();
    this.activePuzzle = null;
  }

  handlerMouseMove = (mousePosition: MousePosition): void => {
    const resolvedPuzzel = this.puzzleResolver(mousePosition);
    if (resolvedPuzzel && this.isMovePossible(resolvedPuzzel)) {
      this.activatePuzzle(resolvedPuzzel);
    } else if (!resolvedPuzzel) {
      this.deactivatePuzzle();
    }
  };

  handlerClick = (mousePosition: MousePosition): void => {
    const resolvedPuzzel = this.puzzleResolver(mousePosition);

    if (resolvedPuzzel && this.isMovePossible(resolvedPuzzel)) {
      this.movePuzzle(resolvedPuzzel);
      this.deactivatePuzzle();
    }
  };

  draw(ctx: CanvasRenderingContext2D): void {
    this.puzzles.forEach((puzzle) => puzzle.draw(ctx));
  }
}
