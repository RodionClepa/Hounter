import { apiService } from "../services/api.service.js";
import { DATA_URL, DEFAULT_RECOMMENDATION } from "../config.js";
import { Model } from "../Model.js";

export class RecommendationModel extends Model {
  eventTypes = {
    dataChange: "changeData",
  };

  constructor() {
    super();
    this.eventBus.updateEventTypes(this.eventTypes);
    this._data = [];
    this._listeners = [];
  }

  async fetchData(type = DEFAULT_RECOMMENDATION) {
    try {
      const data = await apiService.get(
        `${DATA_URL}recommendations-${type}.json`,
      );
      this._data = data;
      this.eventBus.notify(this.eventTypes.dataChange, this._data);
    } catch (error) {
      console.error("Failed to load recommendations:", error);
    }
  }

  async fetchAllAndMergeData(types = []) {
    try {
      const fetchPromises = types.map((type) =>
        apiService.get(`${DATA_URL}recommendations-${type}.json`),
      );
      const results = await Promise.all(fetchPromises);
      const mergedData = results.flat();

      this._data = mergedData;
      this.eventBus.notify(this.eventTypes.dataChange, this._data);
    } catch (error) {
      console.error("Failed to load and merge all recommendations:", error);
    }
  }
}
