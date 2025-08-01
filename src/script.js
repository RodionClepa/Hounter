import { RecommendationView } from "./recommendations/recommendation.view.js";
import { RecommendationModel } from "./recommendations/recommendaiton.model.js";
import { RecommendationController } from "./recommendations/recommendation.controller.js";
import { DraggableSlider } from "./components/draggable-slider.js";

const cloneCarouselContent = function (nodeRef, parentNode) {
  var copy = document.querySelector(nodeRef).cloneNode(true);
  const parent = document.querySelector(parentNode);
  parent.appendChild(copy);
  const tracks = parent.querySelectorAll(".carousel-track");
  if (tracks) {
    tracks.forEach((track) => track.classList.add("animate"));
  }
};

const init = function () {
  cloneCarouselContent(".hero__stat-list", ".stat-carousel");

  const draggableSlider = new DraggableSlider(
    ".slider__container",
    ".slider__item",
  );

  const recommendationController = new RecommendationController();
};
init();
