import { ImageJS } from "./ImageJS/ImageJS";
import { Board } from "./board";
import { Puzzle } from "./puzzle";
import { MousePosition, Resolution, SquareNumber } from "./commonTypes";

import imgEmptyPuzzle from "./assets/emptyPuzzle.png";

export interface GameOptions extends Resolution {
  puzzlesNumber: SquareNumber;
}

export class Game {
  private readonly width: number;

  private readonly height: number;

  private readonly puzzlesNumber: number;

  private readonly gridSize: number;

  private readonly puzzleWidth: number;

  private readonly puzzleHeight: number;

  private readonly board: Board;

  private animatedReq = 0;

  constructor(
    private readonly renderCtx: CanvasRenderingContext2D,
    private readonly image: ImageJS,
    { width, height, puzzlesNumber }: GameOptions
  ) {
    this.width = width;
    this.height = height;

    this.puzzlesNumber = puzzlesNumber;
    this.gridSize = Math.sqrt(puzzlesNumber);

    this.puzzleWidth = width / this.gridSize;
    this.puzzleHeight = height / this.gridSize;

    this.board = new Board(this.createPuzzles, {
      puzzleWidth: this.puzzleWidth,
      puzzleHeight: this.puzzleHeight,
      gridSize: this.gridSize,
    });

    this.initEvents();

    this.draw();
  }

  createPuzzles = async (): Promise<Puzzle[]> => {
    const imagePuzzles = [...this.createImagePuzzles()];
    imagePuzzles.pop();
    const emptyPuzzle = await this.createEmptyPuzzle();

    return [...imagePuzzles, emptyPuzzle];
  };

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

  *createImagePuzzles(): Generator<Puzzle> {
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

  calculateMousePosition({ offsetX, offsetY }: MouseEvent): MousePosition {
    const { canvas } = this.renderCtx;
    const ratio =
      this.width > this.height
        ? this.width / canvas.offsetWidth
        : this.height / canvas.offsetHeight;

    return { offsetX: offsetX * ratio, offsetY: offsetY * ratio };
  }

  handlerMouseMove = (e: MouseEvent): void => {
    const mousePosition = this.calculateMousePosition(e);
    this.board.handlerMouseMove(mousePosition);
  };

  initEvents(): void {
    const { canvas } = this.renderCtx;
    canvas.addEventListener("mousemove", this.handlerMouseMove);
  }

  draw = (): void => {
    ImageJS.clearCanvas(this.renderCtx);
    this.board.draw(this.renderCtx);
    this.animatedReq = requestAnimationFrame(this.draw);
  };
}
