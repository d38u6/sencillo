import { ImageJS } from "./ImageJS/ImageJS";
import { Game, GameOptions } from "./game";

interface SencilloOptions extends GameOptions {
  responsive: boolean;
}

async function main(): Promise<void> {
  const image = await ImageJS.createFromFile("./images/1920x1280.jpg");
  const game = new Game("canvas-wrapper", image, {
    width: 1920,
    height: 1080,
    puzzlesNumber: 16,
  });
}
main();
