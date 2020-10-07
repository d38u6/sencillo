import { Resolution } from "./commonTypes";

export class GameUI {
  constructor(
    private readonly divElId: string,
    private readonly canvasResolution: Resolution
  ) {
    this.initCanvas();
  }

  private initCanvas(): void {
    const parentDiv = document.getElementById(this.divElId) as HTMLDivElement;
    if (!parentDiv) {
      throw new Error("Cant find parent div element");
    }
    const canvas = document.createElement("canvas");
    canvas.width = this.canvasResolution.width;
    canvas.height = this.canvasResolution.height;
    parentDiv.appendChild(canvas);
  }

  get canvas(): HTMLCanvasElement {
    const canvas = document.querySelector(
      `#${this.divElId} canvas`
    ) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error("Cant get canvas element");
    }
    return canvas;
  }

  get renderCtx(): CanvasRenderingContext2D {
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Cant get canvas rendering context");
    }
    return ctx;
  }
}
