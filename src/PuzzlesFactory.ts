import { ImageJS } from "./ImageJS/ImageJS";
import { Puzzle } from "./puzzle";

interface PuzzlesFactoryOptions {
  puzzleWidth: number;
  puzzleHeight: number;
  gridSize: number;
}

export class PuzzlesFactory {
  constructor(private readonly image: ImageJS) {}

  createPuzzles = (options: PuzzlesFactoryOptions): Puzzle[] => {
    const imagePuzzles = [...this.createImagePuzzles(options)];
    imagePuzzles.pop();
    const emptyPuzzle = PuzzlesFactory.createEmptyPuzzle(options);

    return [...imagePuzzles, emptyPuzzle];
  };

  private static createEmptyPuzzle({
    puzzleWidth,
    puzzleHeight,
    gridSize,
  }: PuzzlesFactoryOptions): Puzzle {
    const lastIndex = gridSize - 1;
    const emptyPuzzle = new OffscreenCanvas(puzzleWidth, puzzleHeight);

    return new Puzzle(
      emptyPuzzle,
      {
        x: lastIndex * puzzleWidth,
        y: lastIndex * puzzleHeight,
      },
      { x: lastIndex, y: lastIndex },
      true
    );
  }

  private *createImagePuzzles({
    puzzleWidth,
    puzzleHeight,
    gridSize,
  }: PuzzlesFactoryOptions): Generator<Puzzle> {
    for (let x = 0; x < gridSize; x += 1) {
      for (let y = 0; y < gridSize; y += 1) {
        const posX = x * puzzleWidth;
        const posY = y * puzzleHeight;
        yield new Puzzle(
          this.image.cut(posX, posY, puzzleWidth, puzzleHeight),
          { x: posX, y: posY },
          {
            x,
            y,
          }
        );
      }
    }
  }
}
