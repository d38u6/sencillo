import { ImageJS } from "./imageJS/ImageJS";
import { Game } from "./game/Game";
import { DashboardUI } from "./game/DashboardUI";
import { GameUI } from "./game/GameUI";

function getImageSrc(): string {
  const src = new URLSearchParams(window.location.search).get("image");
  if (!src) {
    throw new Error("Can't get image source");
  }
  return `./${src}`;
}

async function main(): Promise<void> {
  try {
    const imageSrc = getImageSrc();
    const image = await ImageJS.createFromFile(imageSrc);
    const gameUI = new GameUI("canvas-wrapper", { width: 1920, height: 1080 });

    const game = new Game(gameUI.renderCtx, image, {
      level: 16,
    });

    const dashboardUI = new DashboardUI();

    game.addObserver(dashboardUI.update);

    dashboardUI.onStartClick.listen(game.start);
    dashboardUI.onLevelChange.listen(game.changeLevel);
    dashboardUI.onPreviewClick.listen(game.switchPreviewMode);
  } catch (e) {
    window.location.href = "./";
  }
}
main();
