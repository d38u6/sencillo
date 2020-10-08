import { ImageJS } from "./ImageJS/ImageJS";
import { Board } from "./board";
import { Level } from "./commonTypes";
import { Timer } from "./Timer";
import { PuzzlesFactory } from "./PuzzlesFactory";
import { PuzzleResolver } from "./PuzzleResolver";

export interface GameState {
  time: number;
  move: number;
  level: Level;
  isStarted: boolean;
  previewMode: boolean;
}

export interface GameOptions {
  level: Level;
}

type GameObserver = (gameState: GameState) => void;

export class Game {
  private readonly width: number;

  private readonly height: number;

  private level: Level;

  private readonly image: ImageJS;

  private readonly board: Board;

  private readonly puzzlesFactory: PuzzlesFactory;

  private previewMode = false;

  private animatedReq = 0;

  private observers: GameObserver[] = [];

  private readonly timer = new Timer();

  private isStarted = false;

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

    this.board = new Board(this.puzzlesFactory, new PuzzleResolver(renderCtx), {
      width: this.width,
      height: this.height,
      puzzlesNumber: this.level,
    });

    this.initEvents();

    this.update();
  }

  get gameState(): GameState {
    return {
      time: this.timer.time,
      move: 0,
      level: this.level,
      isStarted: this.isStarted,
      previewMode: false,
    };
  }

  private initEvents(): void {
    const { canvas } = this.renderCtx;
    canvas.addEventListener("mousemove", this.board.handlerMouseMove);
    canvas.addEventListener("click", this.board.handlerClick);
  }

  // observer Methods
  addObserver(observer: GameObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers = [...this.observers, observer];
    }
  }

  removeObserver(observer: GameObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  switchPreviewMode = (): void => {
    this.previewMode = !this.previewMode;
  };

  changeLevel = (level: Level): void => {
    this.level = level;
    this.board.changePuzzlesNumber(level);
  };

  start = (): void => {
    this.isStarted = true;
    this.timer.start();
    this.board.shufflePuzzles();
    this.board.unlock();
  };

  private draw = (): void => {
    ImageJS.clearCanvas(this.renderCtx);
    if (this.previewMode) {
      this.image.draw(this.renderCtx);
    } else {
      this.board.draw(this.renderCtx);
    }
  };

  private update = (): void => {
    this.observers.forEach((observer) => observer(this.gameState));
    this.draw();
    this.animatedReq = requestAnimationFrame(this.update);
  };
}
