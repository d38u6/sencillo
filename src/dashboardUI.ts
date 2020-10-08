import { SquareNumber } from "./commonTypes";
import { GameState } from "./game";
import { Timer } from "./Timer";
import { onlySquareNumber, getKeys, has } from "./utility";

const selectors = {
  timeCounter: "time-counter",
  moveCounter: "move-counter",
  levelSelect: "level-select",
  previewBtn: "preview-btn",
  startBtn: "start-btn",
};

type listnerCallback = (puzzlesNumbers: SquareNumber) => void;

export class DashboardUI {
  private readonly timeCounter: HTMLSpanElement;

  private readonly moveCounter: HTMLSpanElement;

  private readonly levelSelect: HTMLSelectElement;

  private readonly startBtn: HTMLButtonElement;

  private readonly previewBtn: HTMLButtonElement;

  private gameState: GameState = {
    time: 0,
    move: 0,
    level: 9,
    isStart: false,
    previewMode: false,
  };

  private puzzlesNumber: SquareNumber = 9;

  constructor() {
    this.timeCounter = document.getElementById(
      selectors.timeCounter
    ) as HTMLSpanElement;

    this.moveCounter = document.getElementById(
      selectors.moveCounter
    ) as HTMLSpanElement;

    this.levelSelect = document.getElementById(
      selectors.levelSelect
    ) as HTMLSelectElement;
    this.levelSelect.addEventListener("change", this.handlerLevelChange);

    this.startBtn = document.getElementById(
      selectors.startBtn
    ) as HTMLButtonElement;

    this.previewBtn = document.getElementById(
      selectors.previewBtn
    ) as HTMLButtonElement;
  }

  handlerLevelChange = (e: Event): void => {
    const value = +(e.target as HTMLSelectElement)?.value;
    this.puzzlesNumber = onlySquareNumber(value);
  };

  confirm(callback: () => void): void {
    if (this.gameState.isStart) {
      // eslint-disable-next-line no-alert
      if (window.confirm("Postęp rozgrywki zostanie utracony")) {
        callback();
      }
    } else {
      callback();
    }
  }

  updateDOM(): void {
    this.startBtn.innerText = this.gameState.isStart
      ? "Rozpocznij"
      : "Zacznij od nowa";
    this.moveCounter.innerText = `${this.gameState.move}`;
    this.timeCounter.innerText = `${Timer.formatTime(this.gameState.time)}`;
  }

  update = (gameState: GameState): void => {
    getKeys(gameState).forEach((key) => {
      if (
        has(gameState, key) &&
        has(this.gameState, key) &&
        this.gameState[key] !== gameState[key]
      ) {
        this.gameState = { ...gameState };
        this.updateDOM();
      }
    });
  };

  addListner(name: string, callback: listnerCallback): void {
    switch (name) {
      case "start": {
        this.startBtn.addEventListener("click", () => {
          this.confirm(() => {
            callback(this.puzzlesNumber);
          });
        });
        break;
      }
      case "levelChange": {
        this.levelSelect.addEventListener("change", () => {
          this.confirm(() => {
            callback(this.puzzlesNumber);
          });
        });
        break;
      }
      case "preview": {
        this.previewBtn.addEventListener("click", () => {
          callback(this.puzzlesNumber);
        });
        break;
      }
      default:
    }
  }
}
