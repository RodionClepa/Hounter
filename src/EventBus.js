export class EventBus {
  constructor(eventTypes) {
    this._listeners = {};
    this.eventTypes = { ...eventTypes };
  }

  subscribe(eventType, listener) {
    if (!this._listeners[eventType]) {
      this._listeners[eventType] = [];
    }
    this._listeners[eventType].push(listener);
  }

  notify(eventType, payload) {
    if (!this._listeners[eventType]) return;
    this._listeners[eventType].forEach((listener) => listener(payload));
  }
}
