import { Model } from "../Model.js";
import { apiService } from "../services/api.service.js";
import { DATA_URL } from "../config.js";

export class ReviewModel extends Model {
  eventTypes = {
    dataChange: "changeData",
  };

  constructor() {
    super();
    this.eventBus.updateEventTypes(this.eventTypes);
    this._data = [];
  }

  async fetchData() {
    try {
      const data = await apiService.get(`${DATA_URL}reviews.json`);
      this._data = data;
      this.eventBus.notify(this.eventTypes.dataChange, this._data);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  }
}
