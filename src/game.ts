import { ImageJS } from "./ImageJS/ImageJS";
import { Board } from "./board";
import { Puzzle } from "./puzzle";
import { MousePosition, Resolution, SquareNumber } from "./commonTypes";

export interface GameOptions extends Resolution {
  puzzlesNumber: SquareNumber;
}

export class Game {
  private renderCtx: CanvasRenderingContext2D | undefined;

  private readonly width: number;

  private readonly height: number;

  private puzzlesNumber: SquareNumber = 0;

  private gridSize = 0;

  private puzzleWidth = 0;

  private puzzleHeight = 0;

  private readonly image: ImageJS;

  private board: Board | undefined;

  private animatedReq = 0;

  constructor(
    divElId: string,
    image: ImageJS,
    { puzzlesNumber, width, height }: GameOptions
  ) {
    this.width = width;
    this.height = height;
    this.image = image.rescale({ width, height });
    this.initCanvas(divElId);
    this.initBoard(puzzlesNumber);
    this.draw();
  }

  initCanvas(divElId: string): void {
    const parentDiv = document.getElementById(divElId) as HTMLDivElement;
    if (!parentDiv) {
      throw new Error("Cant find div element");
    }
    const canvas = document.createElement("canvas");
    this.renderCtx = canvas.getContext("2d")!;
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.addEventListener("mousemove", this.handlerMouseMove);
    canvas.addEventListener("click", this.handlerClick);
    parentDiv.appendChild(canvas);
  }

  initBoard(puzzlesNumber: SquareNumber): void {
    this.puzzlesNumber = puzzlesNumber;
    this.gridSize = Math.sqrt(puzzlesNumber);

    this.puzzleWidth = this.width / this.gridSize;
    this.puzzleHeight = this.height / this.gridSize;

    this.board = new Board(this.createPuzzles, {
      puzzleWidth: this.puzzleWidth,
      puzzleHeight: this.puzzleHeight,
      gridSize: this.gridSize,
    });
  }

  createPuzzles = (): Puzzle[] => {
    const imagePuzzles = [...this.createImagePuzzles()];
    imagePuzzles.pop();
    const emptyPuzzle = this.createEmptyPuzzle();

    return [...imagePuzzles, emptyPuzzle];
  };

  createEmptyPuzzle(): Puzzle {
    const { puzzleWidth, puzzleHeight, gridSize } = this;
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

  *createImagePuzzles(): Generator<Puzzle> {
    const { puzzleWidth, puzzleHeight, gridSize } = this;
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

  calculateMousePosition({ offsetX, offsetY }: MouseEvent): MousePosition {
    if (this.renderCtx) {
      const { canvas } = this.renderCtx;
      const ratio =
        this.width > this.height
          ? this.width / canvas.offsetWidth
          : this.height / canvas.offsetHeight;

      return { offsetX: offsetX * ratio, offsetY: offsetY * ratio };
    }
    return { offsetX, offsetY };
  }

  handlerMouseMove = (e: MouseEvent): void => {
    const mousePosition = this.calculateMousePosition(e);
    this.board?.handlerMouseMove(mousePosition);
  };

  handlerClick = (e: MouseEvent): void => {
    const mousePosition = this.calculateMousePosition(e);
    this.board?.handlerClick(mousePosition);
  };

  draw = (): void => {
    if (this.renderCtx) {
      ImageJS.clearCanvas(this.renderCtx);
      this.board?.draw(this.renderCtx);
      this.animatedReq = requestAnimationFrame(this.draw);
    }
  };
}
