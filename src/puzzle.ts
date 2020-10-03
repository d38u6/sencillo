import { Resolution } from "./commonTypes";

type Border = [number, string];

type Coordinates = { x: number; y: number };

const borders: { [key: string]: Border } = {
  common: [5, "#fff"],
  active: [10, "#007bff"],
};

export class Puzzle {
  isActive = false;

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

    this.redrawSource();
    this.addBorder(borders.common);
  }

  focus(): void {
    this.isActive = true;
    this.redrawSource();
    this.addBorder(borders.active);
  }

  blur(): void {
    this.isActive = false;
    this.redrawSource();
    this.addBorder(borders.common);
  }

  // Draw Methods

  private addBorder([width, color]: Border): void {
    const ctx = this.source.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.strokeRect(0, 0, this.source.width, this.source.height);
    }
  }

  private redrawSource(): void {
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
