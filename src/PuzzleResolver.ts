import { MousePosition } from "./commonTypes";
import { Puzzle } from "./Puzzle";

export class PuzzleResolver {
  constructor(private readonly renderCtx: CanvasRenderingContext2D) {}

  private convertMousePosition({
    offsetX,
    offsetY,
  }: MousePosition): MousePosition {
    const { canvas } = this.renderCtx;
    const { width, height } = this.renderCtx.canvas;
    const ratio =
      width > height
        ? width / canvas.offsetWidth
        : height / canvas.offsetHeight;

    return { offsetX: offsetX * ratio, offsetY: offsetY * ratio };
  }

  reslove(puzzles: Puzzle[], mousePosition: MousePosition): Puzzle | undefined {
    const { offsetX, offsetY } = this.convertMousePosition(mousePosition);
    const marginW = 35;
    const marginH = 20;

    return puzzles.find(
      ({ resolution: { width, height }, coordinates: { x, y } }) =>
        offsetX > x + marginW &&
        offsetX < x + (width - marginW) &&
        offsetY > y + marginH &&
        offsetY < y + (height - marginH)
    );
  }
}
