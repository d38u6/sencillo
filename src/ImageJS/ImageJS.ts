import { SquareNumber, Resolution } from "../commonTypes";

type imageSlice = {
  posX: number;
  posY: number;
  canvas: OffscreenCanvas;
};

export class ImageJS {
  readonly width: number;

  readonly height: number;

  constructor(private source: CanvasImageSource) {
    this.width = +this.source.width;
    this.height = +this.source.height;
  }

  static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (e) => reject(e));
    });
  }

  static async createFromFile(src: string): Promise<ImageJS> {
    const image = await ImageJS.loadImage(src);
    return new ImageJS(image);
  }

  getSource(): CanvasImageSource {
    return this.source;
  }

  rescale(resolution: Resolution): ImageJS {
    const canvas = new OffscreenCanvas(resolution.width, resolution.height);
    const ctx = canvas.getContext("2d");

    const ratio =
      resolution.width > resolution.height
        ? canvas.width / this.width
        : canvas.height / this.height;

    const width = canvas.width / ratio;
    const height = canvas.height / ratio;
    const shiftW = (this.width - width) / 2;
    const shiftH = (this.height - height) / 2;

    if (ctx) {
      ctx.drawImage(
        this.source,
        shiftW,
        shiftH,
        width,
        height,
        0,
        0,
        resolution.width,
        resolution.height
      );
    }
    return new ImageJS(canvas);
  }

  *sliceToSquares(slicesNumber: SquareNumber): Generator<imageSlice> {
    const gridSize = Math.sqrt(slicesNumber);
    const sliceWidth = Math.floor(this.width / gridSize);
    const sliceHeight = Math.floor(this.height / gridSize);

    for (let x = 0; x < gridSize; x += 1) {
      for (let y = 0; y < gridSize; y += 1) {
        const posX = x * sliceWidth;
        const posY = y * sliceHeight;
        yield {
          posX,
          posY,
          canvas: this.cut(posX, posY, sliceWidth, sliceHeight),
        };
      }
    }
  }

  cut(x: number, y: number, sx: number, sy: number): OffscreenCanvas {
    const canvas = new OffscreenCanvas(sx, sy);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(this.source, x, y, sx, sy, 0, 0, sx, sy);
    }
    return canvas;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    image: CanvasImageSource = this.source
  ): void {
    const { canvas } = ctx;
    canvas.width = +image.width;
    canvas.height = +image.height;

    ctx.drawImage(image, 0, 0);
  }

  drawScaled(ctx: CanvasRenderingContext2D, resolution: Resolution): void {
    const rescaledImg = this.rescale(resolution).getSource();
    this.draw(ctx, rescaledImg);
  }
}
