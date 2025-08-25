import { ReviewModel } from "./reviews.model.js";
import { ReviewView } from "./reviews.view.js";

export class ReviewsController {
  constructor() {
    this.model = new ReviewModel();
    this.view = new ReviewView();

    this.model.subscribe(this.model.eventTypes.dataChange, (data) => {
      this.view.render(data);
      this.view.scrollToIndex(Math.trunc(data.length / 2), "instant");
    });

    this.model.fetchData().catch((err) => {
      console.error("Failed to load Reviews:", err);
      this.view.render([]);
    });
  }
}
