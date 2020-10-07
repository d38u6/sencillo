import { ImageJS } from "./ImageJS/ImageJS";
import { Game } from "./game";
import { DashboardUI } from "./dashboardUI";

function withConfirm(callback: () => void): void {
  // eslint-disable-next-line no-alert
  if (window.confirm("Chcesz rozpocząć grę od nowa?")) {
    callback();
  }
}

async function main(): Promise<void> {
  const image = await ImageJS.createFromFile("./images/1920x1280.jpg");
  const game = new Game("canvas-wrapper", image, {
    width: 1920,
    height: 1080,
    level: 16,
  });

  const dashboardUI = new DashboardUI();

  game.addObserver(dashboardUI.update);

  dashboardUI.addListner("start", game.start);
  dashboardUI.addListner("levelChange", game.changeLevel);
  dashboardUI.addListner("preview", game.switchPreviewMode);
}
main();
