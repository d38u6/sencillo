// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */

export type Callback = (args?: any) => void;
type Listener = { name: string; callback: Callback };

export class EventEmitter {
  private events: Listener[] = [];

  listen(eventName: string, callback: Callback): void {
    this.events.push({ name: eventName, callback });
  }

  remove(callback: Callback): void {
    this.events = this.events.filter((e) => e.callback === callback);
  }

  emit(eventName: string, ...args: any[]): void {
    this.events.forEach(({ name, callback }) => {
      if (name === eventName) {
        callback(...args);
      }
    });
  }
}
