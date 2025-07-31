import { apiService } from "../services/api.service.js";
import { DATA_URL } from "../config.js";

export class RecommendationModel {
  constructor() {
    this._data = [];
    this._listeners = [];
  }

  async fetchData() {
    try {
      const data = await apiService.get(`${DATA_URL}recommendations.json`);
      this._data = data;
      console.log(this._data);
      this._notify();
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  }

  getData() {
    return this._data;
  }

  subscribe(listener) {
    this._listeners.push(listener);
    console.log("listeners", this._listeners);
  }

  _notify() {
    this._listeners.forEach((listener) => listener(this._data));
  }
}
