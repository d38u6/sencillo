import { Level } from "../utility/commonTypes";
import { TypedEvent } from "../utility/TypedEvent";
import { GameState } from "./Game";
import { Timer } from "../utility/Timer";
import { getKeys, has } from "../utility/utility";

const selectors = {
  timeCounter: "#time-counter",
  moveCounter: "#move-counter",
  levelSelect: "#level-select",
  previewBtn: "#preview-btn",
  startBtn: "#start-btn",
};

export class DashboardUI {
  private readonly timeCounter = document.querySelector<HTMLSpanElement>(
    selectors.timeCounter
  )!;

  private readonly moveCounter = document.querySelector<HTMLSpanElement>(
    selectors.moveCounter
  )!;

  private readonly levelSelect = document.querySelector<HTMLSelectElement>(
    selectors.levelSelect
  )!;

  private readonly startBtn = document.querySelector<HTMLButtonElement>(
    selectors.startBtn
  )!;

  private readonly previewBtn = document.querySelector<HTMLButtonElement>(
    selectors.previewBtn
  )!;

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
    this.initEvents();
  }

  initEvents(): void {
    this.levelSelect.addEventListener("change", (e) => {
      const value = +(e.target as HTMLSelectElement)?.value;
      setTimeout(
        () =>
          this.withConfirm(() => {
            this.onLevelChange.emit(value);
          }),
        100
      );
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
