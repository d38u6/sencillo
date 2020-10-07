import { ImageJS } from "./ImageJS/ImageJS";
import { Board } from "./board";
import { MousePosition, SquareNumber, Level } from "./commonTypes";
import { Timer } from "./Timer";
import { PuzzlesFactory } from "./PuzzlesFactory";

export interface GameState {
  timeCounter: number;
  moveCounter: number;
  puzzlesNumber: SquareNumber;
  isStart: boolean;
  previewMode: boolean;
}

export interface GameOptions {
  level: Level;
}

type Observer = (gameState: GameState) => void;

export class Game {
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
    private readonly renderCtx: CanvasRenderingContext2D,
    image: ImageJS,
    { level }: GameOptions
  ) {
    this.width = renderCtx.canvas.width;
    this.height = renderCtx.canvas.height;
    this.level = level;

    this.image = image.rescale({ width: this.width, height: this.height });

    this.puzzlesFactory = new PuzzlesFactory(this.image);

    this.board = new Board(this.puzzlesFactory, {
      width: this.width,
      height: this.height,
      puzzlesNumber: this.level,
    });

    this.initEvents();

    this.draw();
  }

  private initEvents(): void {
    const { canvas } = this.renderCtx;
    canvas.addEventListener("mousemove", this.handlerMouseMove);
    canvas.addEventListener("click", this.handlerClick);
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
    this.board.shufflePuzzles();
    this.board.unlock();
  };

  draw = (): void => {
    this.update();

    ImageJS.clearCanvas(this.renderCtx);
    if (this.previewMode) {
      this.image.draw(this.renderCtx);
    } else {
      this.board?.draw(this.renderCtx);
    }
    this.animatedReq = requestAnimationFrame(this.draw);
  };
}
