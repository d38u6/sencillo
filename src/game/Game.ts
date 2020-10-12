import { ImageJS } from "../imageJS/ImageJS";
import { Board } from "./Board";
import { Level } from "../utility/commonTypes";
import { Timer } from "../timer/Timer";
import { PuzzlesFactory } from "./PuzzlesFactory";
import { PuzzleResolver } from "./PuzzleResolver";
import { fireworks } from "../utility/confetti";

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

  private isStarted = false;

  private readonly timer = new Timer();

  private moveCounter = 0;

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
      move: this.moveCounter,
      level: this.level,
      isStarted: this.isStarted,
      previewMode: this.previewMode,
    };
  }

  private initEvents(): void {
    const { canvas } = this.renderCtx;
    canvas.addEventListener("mousemove", this.board.handlerMouseMove);
    canvas.addEventListener("click", this.board.handlerClick);
    this.board.onMovePuzzle.listen(() => {
      this.moveCounter += 1;
    });
    this.board.onWin.listen(() => {
      this.win();
    });
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
    this.reset();
  };

  reset = (): void => {
    this.isStarted = false;
    this.timer.reset();
    this.moveCounter = 0;
    this.board.lock();
  };

  start = (): void => {
    this.isStarted = true;
    this.moveCounter = 0;
    this.timer.reset();
    this.timer.start();
    this.board.shufflePuzzles();
    this.board.unlock();
  };

  private win(): void {
    this.board.lock();
    this.timer.pause();
    fireworks(60000);
  }

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
