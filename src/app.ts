import { ImageJS } from "./ImageJS/ImageJS";
import { Game, GameOptions } from "./game";

async function sencillo(
  divId: string,
  imgSrc: string,
  options: GameOptions = { width: 1280, height: 720, puzzlesNumber: 36 }
): Promise<void> {
  const div = document.getElementById(divId) as HTMLDivElement;
  const image = await ImageJS.createFromFile(imgSrc);

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
  const game = new Game(ctx, rescaledImage, options);
}

sencillo("divmain", "./images/1920x1280.jpg");
