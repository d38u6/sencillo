import { MousePosition, Resolution } from "./commonTypes";

type Border = [number, string];

type Coordinates = { x: number; y: number };

const borders: { [key: string]: Border } = {
  common: [5, "#fff"],
  active: [10, "#007bff"],
};

export class Puzzle {
  private isActive = false;

  private source: OffscreenCanvas;

  private readonly resolution: Resolution;

  constructor(
    private readonly originalSource: OffscreenCanvas,
    private coordinates: Coordinates
  ) {
    this.resolution = {
      width: originalSource.width,
      height: originalSource.height,
    };

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
      coordinates: { x, y },
      resolution: { width, height },
    } = this;

    return (
      offsetX > x && offsetX < x + width && offsetY > y && offsetY < y + height
    );
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
    const { x, y } = this.coordinates;
    ctx.drawImage(this.source, x, y);
  }
}
