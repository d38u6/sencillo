import { ImageJS } from "./ImageJS/ImageJS";
import { Game } from "./game";
import { DashboardUI } from "./dashboardUI";

async function main(): Promise<void> {
  const image = await ImageJS.createFromFile("./images/1920x1280.jpg");
  const game = new Game("canvas-wrapper", image, {
    width: 1920,
    height: 1080,
    puzzlesNumber: 16,
  });

  const dashboardUI = new DashboardUI();

  dashboardUI.addListner("start", (puzzlesNumber) => {
    game.start();
  });

  dashboardUI.addListner("levelChange", (puzzlesNumber) => {
    game.changeLevel(puzzlesNumber);
  });

  dashboardUI.addListner("preview", () => {
    game.switchPreviewMode();
  });
}
main();
