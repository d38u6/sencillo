import { ImageJS } from "./ImageJS/ImageJS";
import { Board } from "./board";
import { Puzzle } from "./puzzle";
import { MousePosition, SquareNumber, Level, Resolution } from "./commonTypes";
import { Timer } from "./Timer";
import { PuzzlesFactory } from "./PuzzlesFactory";

export interface GameState {
  timeCounter: number;
  moveCounter: number;
  puzzlesNumber: SquareNumber;
  isStart: boolean;
  previewMode: boolean;
}

export interface GameOptions extends Resolution {
  level: Level;
}

type Observer = (gameState: GameState) => void;

export class Game {
  private renderCtx: CanvasRenderingContext2D | undefined;

  private readonly width: number;

  private readonly height: number;

  private level: Level;

  private readonly image: ImageJS;

  private readonly board: Board;

  private readonly puzzlesFactory: PuzzlesFactory;

  private previewMode = false;

  private animatedReq = 0;

  private observers: Observer[] = [];

  private readonly timer = new Timer();

  constructor(
    divElId: string,
    image: ImageJS,
    { level, width, height }: GameOptions
  ) {
    this.width = width;
    this.height = height;
    this.level = level;
    this.image = image.rescale({ width, height });
    this.puzzlesFactory = new PuzzlesFactory(this.image);

    this.initCanvas(divElId);

    this.board = new Board(this.puzzlesFactory, {
      width,
      height,
      puzzlesNumber: this.level,
    });

    this.draw();
  }

  private initCanvas(divElId: string): void {
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

  private calculateMousePosition({
    offsetX,
    offsetY,
  }: MouseEvent): MousePosition {
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

  private handlerMouseMove = (e: MouseEvent): void => {
    const mousePosition = this.calculateMousePosition(e);
    this.board?.handlerMouseMove(mousePosition);
  };

  private handlerClick = (e: MouseEvent): void => {
    const mousePosition = this.calculateMousePosition(e);
    this.board?.handlerClick(mousePosition);
  };

  // observer Methods
  addObserver(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers = [...this.observers, observer];
    }
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  private update(): void {
    const gameState = {
      puzzlesNumber: this.level,
      timeCounter: 0,
      moveCounter: 0,
      isStart: false,
      previewMode: this.previewMode,
    };
    this.observers.forEach((observer) => observer(gameState));
  }

  switchPreviewMode = (): void => {
    this.previewMode = !this.previewMode;
  };

  changeLevel = (level: Level): void => {
    this.level = level;
    // this.initBoard();
  };

  start = (): void => {
    this.timer.start();
    this.board?.shufflePuzzles();
    this.board?.unlock();
  };

  draw = (): void => {
    this.update();
    if (this.renderCtx) {
      ImageJS.clearCanvas(this.renderCtx);
      if (this.previewMode) {
        this.image.draw(this.renderCtx);
      } else {
        this.board?.draw(this.renderCtx);
      }
      this.animatedReq = requestAnimationFrame(this.draw);
    }
  };
}
