export function setCursor(cursor: string): void {
  document.body.style.cursor = cursor;
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
