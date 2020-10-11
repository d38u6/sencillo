export interface Listener<T> {
  (param: T): void;
}

export class TypedEvent<T> {
  private listeners: Listener<T>[] = [];

  listen = (listener: Listener<T>): void => {
    if (!this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  };

  remove = (listener: Listener<T>): void => {
    this.listeners = this.listeners.filter((l) => l !== listener);
  };

  emit = (param: T): void => {
    this.listeners.forEach((listener) => listener(param));
  };
}
