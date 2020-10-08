import { Level } from "./commonTypes";
import { TypedEvent } from "./TypedEvent";
import { GameState } from "./game";
import { Timer } from "./Timer";
import { getKeys, has } from "./utility";

const selectors = {
  timeCounter: "time-counter",
  moveCounter: "move-counter",
  levelSelect: "level-select",
  previewBtn: "preview-btn",
  startBtn: "start-btn",
};

export class DashboardUI {
  private readonly timeCounter: HTMLSpanElement;

  private readonly moveCounter: HTMLSpanElement;

  private readonly levelSelect: HTMLSelectElement;

  private readonly startBtn: HTMLButtonElement;

  private readonly previewBtn: HTMLButtonElement;

  readonly levelChange = new TypedEvent<Level>();

  readonly previewClick = new TypedEvent<void>();

  readonly startClick = new TypedEvent<void>();

  private gameState: GameState = {
    time: 0,
    move: 0,
    level: 9,
    isStarted: false,
    previewMode: false,
  };

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

    this.startBtn = document.getElementById(
      selectors.startBtn
    ) as HTMLButtonElement;

    this.previewBtn = document.getElementById(
      selectors.previewBtn
    ) as HTMLButtonElement;

    this.initEvents();
  }

  initEvents(): void {
    this.levelSelect.addEventListener("change", (e) => {
      const value = +(e.target as HTMLSelectElement)?.value;
      this.levelChange.emit(value);
    });

    this.previewBtn.addEventListener("click", () => {
      this.previewClick.emit();
    });

    this.startBtn.addEventListener("click", () => {
      this.startClick.emit();
    });
  }

  updateDOM(): void {
    this.timeCounter.innerText = `${Timer.formatTime(this.gameState.time)}`;

    this.moveCounter.innerText = `${this.gameState.move}`;

    this.levelSelect.value = `${this.gameState.level}`;

    this.startBtn.innerText = !this.gameState.isStarted
      ? "Rozpocznij"
      : "Zacznij od nowa";
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

  confirm(callback: () => void): void {
    if (this.gameState.isStarted) {
      // eslint-disable-next-line no-alert
      if (window.confirm("Postęp rozgrywki zostanie utracony")) {
        callback();
      }
    } else {
      callback();
    }
  }
}
