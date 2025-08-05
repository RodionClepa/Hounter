import { draggableSlider } from "../components/draggable-slider.js";
import {
  DEFAULT_RECOMMENDATION,
  DELAY_UPDATE_SLIDER_BUTTONS,
} from "../config.js";
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

    this.debouncedButtonControl = debounce(
      this._updateNavigationButtons.bind(this),
      DELAY_UPDATE_SLIDER_BUTTONS,
    );

    this.slider.subscribe(this.slider.eventTypes.currentCardUpdated, () =>
      this.debouncedButtonControl(),
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
    const isNext = type === "next";

    if (isNext) {
      this.slider.scrollNext();
    } else {
      this.slider.scrollPrev();
    }
  }

  _updateNavigationButtons() {
    this.view.setSliderButtonColor("prev", "green");
    this.view.setSliderButtonColor("next", "green");

    if (this.slider.getCurrentCard() === 0) {
      this.view.setSliderButtonColor("prev", "white");
    }
    if (this.slider.isEnd()) {
      this.view.setSliderButtonColor("next", "white");
    }
  }
}
