import { DEFAULT_RECOMMENDATION } from "../config.js";

export class RecommendationController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.subscribe(this.model.eventTypes.dataChange, (data) =>
      this.view.render(data),
    );

    this.view.subscribe(this.view.eventTypes.filterChange, (data) =>
      this.updateDisplayEstate(data),
    );

    this.model.fetchData(DEFAULT_RECOMMENDATION).catch((err) => {
      console.error("Failed to load recommendations:", err);
      this.view.render([]);
    });
  }

  updateDisplayEstate(type) {
    this.model.fetchData(type).catch((err) => {
      console.error("Failed to load recommendations:", err);
      this.view.render([]);
    });
  }
}
