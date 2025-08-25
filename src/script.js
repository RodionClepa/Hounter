import { ArticlesController } from "./articles/articles.controller.js";
import { RecommendationController } from "./recommendations/recommendation.controller.js";
import { ReviewsController } from "./reviews/reviews.controller.js";
import { CustomDropdown } from "./components/custom-drop-down.js";
import { initCharCounters } from "./components/textarea_count.js";
import { initButtonCookie } from "./components/cookie.js";

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

  const recommendationController = new RecommendationController();
  const reviewsController = new ReviewsController();
  const articlesController = new ArticlesController();

  const educationDropdown = new CustomDropdown(
    document.querySelector("#education-drop"),
  );

  const propertyDropdown = new CustomDropdown(
    document.querySelector("#property-drop"),
  );

  initCharCounters();
  initButtonCookie();
};

init();
