import { EventBus } from "../EventBus.js";
import { View } from "../View.js";

export class ReviewView extends View {
  _container = document.getElementById("slide-show");
  _containerDots = document.getElementById("review-dots");
  eventTypes = {};

  constructor() {
    super();
    this.eventBus = new EventBus(this.eventTypes);
  }

  subscribe(eventType, listener) {
    this.eventBus.subscribe(eventType, listener);
  }

  _generateDots(quantity) {
    this._containerDots.innerHTML = "";
    const dotsHTML = Array.from({ length: quantity }, (_, i) =>
      this._generateDot(i),
    ).join("");
    this._containerDots.insertAdjacentHTML("afterbegin", dotsHTML);
  }

  _generateDot(number) {
    return `<button class="dots__dot" data-slide="${number}"></button>`;
  }

  _generateMarkup() {
    this._generateDots(this._data.length);
    return this._data.map((review) => this._generateSlide(review)).join("");
  }

  _generateSlide(review) {
    return `
      <div class="slide-show__item">
        <img
          class="slide-show__image"
          src="${review.image}"
          alt="${review.title}"
        />
        <div class="slide-show__container-review">
          <h4 class="h-4 review__title">
            ${review.title}
          </h4>
          <p class="review__text label-md grey-3">
            ${review.text}
          </p>
          <div class="review__user">
            <div class="review__info">
              <img
                src="${review.user.avatar}"
                alt="${review.user.name}"
                class="contact-info__image"
              />
              <span>
                <p class="label-semi-bold">${review.user.name}</p>
                <p class="label-sm grey-2">${review.user.location}</p>
              </span>
            </div>
            <div class="rating">
              <svg class="rating__icon">
                <use xlink:href="img/icons/sprite.svg#Star"></use>
              </svg>
              <h4 class="h-4">${review.rating}</h4>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
