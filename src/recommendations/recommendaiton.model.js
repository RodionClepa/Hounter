import { apiService } from "../services/api.service.js";
import { DATA_URL, DEFAULT_RECOMMENDATION } from "../config.js";

export class RecommendationModel {
  eventTypes = {
    dataChange: "changeData",
  };

  constructor() {
    this._data = [];
    this._listeners = [];
  }

  async fetchData(type = DEFAULT_RECOMMENDATION) {
    try {
      const data = await apiService.get(
        `${DATA_URL}recommendations-${type}.json`,
      );
      this._data = data;
      this._notify(this.eventTypes.dataChange, this._data);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  }

  getData() {
    return this._data;
  }

  subscribe(eventType, listener) {
    if (!this._listeners[eventType]) {
      this._listeners[eventType] = [];
    }
    this._listeners[eventType].push(listener);
  }

  _notify(eventType, payload) {
    if (!this._listeners[eventType]) return;
    this._listeners[eventType].forEach((listener) => listener(payload));
  }
}
