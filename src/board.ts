import { MousePosition, SquareNumber, Resolution, Level } from "./commonTypes";
import { Puzzle } from "./puzzle";
import { PuzzleResolver } from "./PuzzleResolver";
import { PuzzlesFactory } from "./PuzzlesFactory";
import { randomBetween } from "./utility";

export interface BoardOptions extends Resolution {
  puzzlesNumber: SquareNumber;
}

export class Board {
  private readonly puzzleWidth: number;

  private readonly puzzleHeight: number;

  private gridSize: number;

  private puzzles: Puzzle[] = [];

  private activePuzzle: Puzzle | null = null;

  private emptyPuzzle: Puzzle | undefined;

  private locked = true;

  constructor(
    private readonly puzzlesFactory: PuzzlesFactory,
    private readonly puzzleResolver: PuzzleResolver,
    { width, height, puzzlesNumber }: BoardOptions
  ) {
    this.gridSize = Math.sqrt(puzzlesNumber);
    this.puzzleWidth = width / this.gridSize;
    this.puzzleHeight = height / this.gridSize;

    this.puzzles = this.createPuzzles();
    this.emptyPuzzle = this.puzzles.find(({ isEmpty }) => isEmpty);
  }

  private createPuzzles(): Puzzle[] {
    return this.puzzlesFactory.createPuzzles({
      puzzleWidth: this.puzzleWidth,
      puzzleHeight: this.puzzleHeight,
      gridSize: this.gridSize,
    });
  }

  shufflePuzzles(): void {
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
    const resolvedPuzzel = this.puzzleResolver.reslove(
      this.puzzles,
      mousePosition
    );
    if (resolvedPuzzel && this.isMovePossible(resolvedPuzzel)) {
      this.activatePuzzle(resolvedPuzzel);
    } else if (!resolvedPuzzel) {
      this.deactivatePuzzle();
    }
  };

  handlerClick = (mousePosition: MousePosition): void => {
    if (this.locked) return;
    const resolvedPuzzel = this.puzzleResolver.reslove(
      this.puzzles,
      mousePosition
    );

    if (resolvedPuzzel && this.isMovePossible(resolvedPuzzel)) {
      this.movePuzzle(resolvedPuzzel);
      this.deactivatePuzzle();
    }
  };

  changePuzzlesNumber(puzzleNumber: Level): void {
    this.gridSize = Math.sqrt(puzzleNumber);
    this.puzzles = this.createPuzzles();
  }

  unlock(): void {
    this.locked = false;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.puzzles.forEach((puzzle) => puzzle.draw(ctx));
  }
}
