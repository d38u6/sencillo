import confetti from "canvas-confetti";
import { randomBetweenFloat, randomBetween } from "./utility";

const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

export function fireworks(duration: number): void {
  const endTime = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = endTime - Date.now();
    const particleCount = Math.ceil(50 * (timeLeft / duration));

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: particleCount < 0 ? 0 : particleCount,
        origin: { x: randomBetweenFloat(0.1, 0.3), y: Math.random() - 0.2 },
      });
    }, randomBetween(10, 300));

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: particleCount < 0 ? 0 : particleCount,
        origin: { x: randomBetweenFloat(0.4, 0.6), y: Math.random() - 0.2 },
      });
    }, randomBetween(10, 300));

    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: particleCount < 0 ? 0 : particleCount,
        origin: { x: randomBetweenFloat(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, randomBetween(10, 300));

    if (timeLeft <= 0) {
      confetti.reset();
      clearInterval(interval);
    }
  }, 300);
}
