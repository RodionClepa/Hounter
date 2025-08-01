import { RecommendationView } from "./recommendations/recommendation.view.js";
import { RecommendationModel } from "./recommendations/recommendaiton.model.js";
import { RecommendationController } from "./recommendations/recommendation.controller.js";

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
};
init();

const model = new RecommendationModel();
const view = new RecommendationView();
const controller = new RecommendationController(model, view);
