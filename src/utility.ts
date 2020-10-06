import { SquareNumber } from "./commonTypes";

export function setCursor(cursor: string): void {
  document.body.style.cursor = cursor;
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function onlySquareNumber(number: number): SquareNumber {
  return number === 0 ||
    number === 9 ||
    number === 16 ||
    number === 25 ||
    number === 36
    ? number
    : 9;
}
