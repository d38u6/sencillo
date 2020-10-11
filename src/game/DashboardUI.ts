import { Level } from "../utility/commonTypes";
import { TypedEvent } from "../utility/TypedEvent";
import { GameState } from "./Game";
import { Timer } from "../timer/Timer";
import { getKeys, has } from "../utility/utility";

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

  readonly onLevelChange = new TypedEvent<Level>();

  readonly onPreviewClick = new TypedEvent<void>();

  readonly onStartClick = new TypedEvent<void>();

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
      this.withConfirm(() => {
        this.onLevelChange.emit(value);
      });
    });

    this.previewBtn.addEventListener("click", () => {
      this.onPreviewClick.emit();
    });

    this.startBtn.addEventListener("click", () => {
      this.withConfirm(() => {
        this.onStartClick.emit();
      });
    });
  }

  updateDOM(): void {
    this.timeCounter.innerText = `${Timer.formatTime(this.gameState.time)}`;

    this.moveCounter.innerText = `${this.gameState.move}`;

    this.levelSelect.value = `${this.gameState.level}`;

    if (
      this.previewBtn.classList.contains("active") !==
      this.gameState.previewMode
    ) {
      this.previewBtn.classList.toggle("active");
    }

    this.startBtn.innerText = !this.gameState.isStarted
      ? "Rozpocznij"
      : "Zacznij od nowa";
  }

  update = (gameState: GameState): void => {
    let isUpdated = false;
    getKeys(gameState).forEach((key) => {
      if (
        has(gameState, key) &&
        has(this.gameState, key) &&
        this.gameState[key] !== gameState[key]
      ) {
        isUpdated = true;
      }
    });
    if (isUpdated) {
      this.gameState = { ...gameState };
      this.updateDOM();
    }
  };

  withConfirm(callback: () => void): void {
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
