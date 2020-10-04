import { Resolution } from "./commonTypes";
import { changeCursor } from "./utility";

type Border = [number, string];

type Coordinates = { x: number; y: number };

const borders: { [key: string]: Border } = {
  common: [0.2, "#fff"],
  active: [10, "#007bff"],
};

export class Puzzle {
  isActive = false;

  private source: OffscreenCanvas;

  private readonly resolution: Resolution;

  constructor(
    private readonly originalSource: OffscreenCanvas,
    public coordinates: Coordinates,
    public gridPosition: Coordinates,
    public readonly isEmpty = false
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
    if (!this.isActive) {
      this.isActive = true;
      this.redrawSource();
      this.addBorder(borders.active);
      changeCursor("pointer");
    }
  }

  blur(): void {
    if (this.isActive) {
      this.isActive = false;
      this.redrawSource();
      this.addBorder(borders.common);
      changeCursor("default");
    }
  }

  private setCoordinates({ x, y }: Coordinates): void {
    this.coordinates.x = x;
    this.coordinates.y = y;
  }

  private setGridPosition({ x, y }: Coordinates): void {
    this.gridPosition.x = x;
    this.gridPosition.y = y;
  }

  createMoveAnimation({ x, y }: Coordinates, time: number): () => void {
    const stepX = (x - this.coordinates.x) / (time / 16);
    const stepY = (y - this.coordinates.y) / (time / 16);

    const animation = (): void => {
      const diffX = Math.abs(x - this.coordinates.x);
      const diffY = Math.abs(y - this.coordinates.y);
      if (diffX <= Math.abs(stepX) && diffY <= Math.abs(stepY)) {
        this.setCoordinates({ x, y });
      } else {
        this.setCoordinates({
          x: this.coordinates.x + stepX,
          y: this.coordinates.y + stepY,
        });
        requestAnimationFrame(animation);
      }
    };
    return animation;
  }

  moveTo({ x, y }: Coordinates): void {
    const posX = x * this.resolution.width;
    const posY = y * this.resolution.height;
    this.setGridPosition({ x, y });
    const animation = this.createMoveAnimation({ x: posX, y: posY }, 275);
    requestAnimationFrame(animation);
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
    if (this.isEmpty) ctx.globalCompositeOperation = "destination-over";
    ctx.drawImage(this.source, x, y);
  }
}
