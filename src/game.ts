import { ImageJS } from "./imageJS/ImageJS";
import { Game } from "./game/Game";
import { DashboardUI } from "./game/DashboardUI";
import { GameUI } from "./game/GameUI";

async function main(): Promise<void> {
  const image = await ImageJS.createFromFile("./images/1920x1280.jpg");

  const gameUI = new GameUI("canvas-wrapper", { width: 1920, height: 1080 });

  const game = new Game(gameUI.renderCtx, image, {
    level: 16,
  });

  const dashboardUI = new DashboardUI();

  game.addObserver(dashboardUI.update);

  dashboardUI.onStartClick.listen(game.start);
  dashboardUI.onLevelChange.listen(game.changeLevel);
  dashboardUI.onPreviewClick.listen(game.switchPreviewMode);
}
main();