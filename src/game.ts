import { ImageJS } from "./ImageJS/ImageJS";
import { Board } from "./board";
import { MousePosition, Resolution, SquareNumber } from "./commonTypes";

export interface GameOptions extends Resolution {
  puzzlesNumber: SquareNumber;
}

export class Game {
  private width: number;

  private height: number;

  private board: Board;

  private animatedReq = 0;

  constructor(
    private readonly renderCtx: CanvasRenderingContext2D,
    private readonly image: ImageJS,
    { width, height, puzzlesNumber }: GameOptions
  ) {
    this.width = width;
    this.height = height;

    this.board = new Board(this.image, {
      width,
      height,
      gridSize: Math.sqrt(puzzlesNumber),
    });

    this.initEvents();

    this.draw();
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
    this.board.draw(this.renderCtx);
    this.animatedReq = requestAnimationFrame(this.draw);
  };
}
