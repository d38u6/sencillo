import { MousePosition } from "./commonTypes";

type Border = [number, string];

interface Pos {
  posX: number;
  posY: number;
  gridX: number;
  gridY: number;
}

const borders: { [key: string]: Border } = {
  common: [5, "#fff"],
  active: [10, "#007bff"],
};

export class Puzzle {
  private isActive = false;

  private source: OffscreenCanvas;

  constructor(
    private readonly originalSource: OffscreenCanvas,
    private position: Pos
  ) {
    this.source = new OffscreenCanvas(
      originalSource.width,
      originalSource.height
    );
    this.reDrawSource();
    this.drawBorder(borders.common);
  }

  // Mouse Events

  isMouseOn({ offsetX, offsetY }: MousePosition): boolean {
    const {
      source: { width, height },
      position: { gridX, gridY },
    } = this;
    const mouseGridX = Math.floor(offsetX / width);
    const mouseGridY = Math.floor(offsetY / height);

    return mouseGridX === gridX && mouseGridY === gridY;
  }

  handlerMouseMove = (mousePosition: MousePosition): void => {
    if (this.isMouseOn(mousePosition)) {
      this.handlerMouseOn();
    } else {
      this.handlerMouseOff();
    }
  };

  handlerMouseOn(): void {
    if (!this.isActive) {
      this.isActive = true;
      this.reDrawSource();
      this.drawBorder(borders.active);
    }
  }

  handlerMouseOff(): void {
    if (this.isActive) {
      this.isActive = false;
      this.reDrawSource();
      this.drawBorder(borders.common);
    }
  }

  // Draw Methods

  drawBorder([width, color]: Border): void {
    const ctx = this.source.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.strokeRect(0, 0, this.source.width, this.source.height);
    }
  }

  reDrawSource(): void {
    const ctx = this.source.getContext("2d");
    if (ctx) {
      ctx.drawImage(this.originalSource, 0, 0);
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { posX, posY } = this.position;
    ctx.drawImage(this.source, posX, posY);
  }
}
