import { draggableSlider } from "../components/draggable-slider.js";
import { DEFAULT_RECOMMENDATION } from "../config.js";
import { RecommendationModel } from "./recommendaiton.model.js";
import { RecommendationView } from "./recommendation.view.js";
import { debounce } from "../utility/debounce.js";

export class RecommendationController {
  constructor() {
    this.model = new RecommendationModel();
    this.view = new RecommendationView();
    this.slider = draggableSlider;

    this.model.subscribe(this.model.eventTypes.dataChange, (data) =>
      this.view.render(data),
    );

    this.view.subscribe(this.view.eventTypes.filterChange, (data) =>
      this.updateDisplayEstate(data),
    );

    const debouncedSlideNavigate = debounce(this.slideNavigate.bind(this), 400);
    this.view.subscribe(this.view.eventTypes.sliderNavigate, (type) =>
      debouncedSlideNavigate(type),
    );

    this.model.fetchData(DEFAULT_RECOMMENDATION).catch((err) => {
      console.error("Failed to load recommendations:", err);
      this.view.render([]);
    });
  }

  updateDisplayEstate(type) {
    this.slider.scrollStart();
    this.model.fetchData(type).catch((err) => {
      console.error("Failed to load recommendations:", err);
      this.view.render([]);
    });
  }

  slideNavigate(type) {
    if (type === "next") {
      this.slider.scrollNext();
    } else {
      this.slider.scrollPrev();
    }
  }
}
