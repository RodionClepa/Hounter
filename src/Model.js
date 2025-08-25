import { EventBus } from "./EventBus.js";

export class Model {
  constructor(eventTypes) {
    this.eventBus = new EventBus(eventTypes);
  }

  getData() {
    return this._data;
  }

  subscribe(eventType, listener) {
    this.eventBus.subscribe(eventType, listener);
  }
}
