import { ImageJS } from "./ImageJS/ImageJS";
import { Game, GameOptions } from "./game";

interface SencilloOptions extends GameOptions {
  responsive: boolean;
}

const padding = 30;

async function sencillo(
  divId: string,
  imgSrc: string,
  options: SencilloOptions = {
    width: 1280,
    height: 720,
    puzzlesNumber: 16,
    responsive: false,
  }
): Promise<void> {
  const image = await ImageJS.createFromFile(imgSrc);

  // init main div
  const div = document.getElementById(divId) as HTMLDivElement;
  div.style.width = options.responsive
    ? "100%"
    : `${options.width + padding * 2}px`;
  div.style.height = options.responsive
    ? "100%"
    : `${options.height + padding * 2}px`;

  // init canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  div.appendChild(canvas);

  // set size
  const { width, height } = options;
  canvas.width = width;
  canvas.height = height;
  const rescaledImage = image.rescale({ width, height });

  // init Game
  const { responsive, ...gameOptions } = options;
  const game = new Game(ctx, rescaledImage, gameOptions);
}

sencillo("divmain", "./images/1920x1280.jpg");
