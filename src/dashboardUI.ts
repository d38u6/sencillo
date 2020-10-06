import { SquareNumber } from "./commonTypes";
import { onlySquareNumber } from "./utility";

const selectors = {
  timeCounter: "time-counter",
  moveCounter: "move-counter",
  levelSelect: "level-select",
  previewBtn: "preview-btn",
  startBtn: "start-btn",
};

type listnerCallback = (puzzlesNumbers: SquareNumber) => void;

type Listner = {
  name: string;
  callback: listnerCallback;
};

export class DashboardUI {
  private readonly timeCounter: HTMLSpanElement;

  private readonly moveCounter: HTMLSpanElement;

  private readonly levelSelect: HTMLSelectElement;

  private readonly startBtn: HTMLButtonElement;

  private readonly previewBtn: HTMLButtonElement;

  private gameStarted = false;

  private puzzlesNumber: SquareNumber = 0;

  private listners: Listner[] = [];

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
    this.levelSelect.addEventListener("change", () => {
      const value = +this.levelSelect.value;
      this.puzzlesNumber = onlySquareNumber(value);
    });

    this.startBtn = document.getElementById(
      selectors.startBtn
    ) as HTMLButtonElement;

    this.previewBtn = document.getElementById(
      selectors.previewBtn
    ) as HTMLButtonElement;
  }

  addListner(name: string, callback: listnerCallback): void {
    switch (name) {
      case "start": {
        this.startBtn.addEventListener("click", () => {
          if (!this.gameStarted) callback(this.puzzlesNumber);
        });
        break;
      }
      case "levelChange": {
        this.levelSelect.addEventListener("change", () => {
          callback(this.puzzlesNumber);
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
