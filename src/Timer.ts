const intervalTimeout = 1000;

export class Timer {
  private timeInterval = 0;

  private _time = 0;

  start(): void {
    this.timeInterval = setInterval(() => {
      this._time += intervalTimeout / 1000;
    }, intervalTimeout);
  }

  pause(): void {
    clearInterval(this.timeInterval);
  }

  reset(): void {
    this._time = 0;
  }

  private formatTime(): string {
    const min = Math.floor(this._time / 60);
    const sec = this._time % 60;

    return `${min} min ${sec} sec`;
  }

  get time(): number {
    return this._time;
  }

  get formattedTime(): string {
    return this.formatTime();
  }
}
