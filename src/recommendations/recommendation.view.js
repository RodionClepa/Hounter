import { EventBus } from "../EventBus.js";
import { labelView } from "../services/label-view.service.js";
import { View } from "../View.js";

export class RecommendationView extends View {
  _container = document.getElementById("recommendations-slider");
  _filterControl = document.querySelector(".filter__list");
  _sliderControl = document.querySelector(".slider__control");
  eventTypes = {
    filterChange: "filterChange",
    sliderNavigate: "sliderNavigate",
  };

  constructor() {
    super();
    this.eventBus = new EventBus(this.eventTypes);
    this._filterControl.addEventListener(
      "click",
      this._handleFilterButtonClicks.bind(this),
    );
    this._sliderControl.addEventListener(
      "click",
      this._handleSliderButtonClicks.bind(this),
    );
  }

  _handleFilterButtonClicks(e) {
    const clickedButton = e.target.closest("button");

    if (!clickedButton || !this._filterControl.contains(clickedButton)) return;

    const allButtons = this._filterControl.querySelectorAll("button");
    allButtons.forEach((btn) => btn.classList.remove("btn--active"));
    clickedButton.classList.add("btn--active");
    const type = clickedButton.dataset.type;
    this.eventBus.notify(this.eventTypes.filterChange, type);
  }

  deselectFilterButton() {
    const allButtons = [...this._filterControl.querySelectorAll("button")];
    allButtons.forEach((button) => button.classList.remove("btn--active"));
  }

  _handleSliderButtonClicks(e) {
    const clickedButton = e.target.closest("button");

    if (!clickedButton || !this._sliderControl.contains(clickedButton)) return;
    const type = clickedButton.dataset.type;
    this.eventBus.notify(this.eventTypes.sliderNavigate, type);
  }

  subscribe(eventType, listener) {
    this.eventBus.subscribe(eventType, listener);
  }

  setSliderButtonColor(direction, color) {
    const validDirections = ["prev", "next"];
    const validColors = ["white", "green"];

    if (!validDirections.includes(direction) || !validColors.includes(color)) {
      return;
    }

    const button = this._sliderControl.querySelector(
      `[data-type="${direction}"]`,
    );

    if (!button) {
      return;
    }

    validColors.forEach((cls) => button.classList.remove(`btn--${cls}`));
    button.classList.add(`btn--${color}`);
  }

  _generateMarkup() {
    return this._data.map((house) => this._generateSlide(house)).join("");
  }

  _formatMoney(amount) {
    return "$ " + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  _generateSlide(house) {
    return `
      <div class="slider__item">
        <div class="slider__image-container">
          <img
            src="${house.image}"
            alt="${house.name}"
            class="slider__image"
          />

         ${labelView(house.dealType)} 

        </div>
        <div class="slider__item-info">
          <h3 class="h-3">${house.name}</h3>
          <h4 class="h-4 grey-3">${this._formatMoney(house.price)}</h4>
        </div>
        <div class="contact-info">
          <img
            src="${house.owner.image}"
            alt="${house.owner.name}"
            class="contact-info__image"
          />
          <div class="contact-info__add">
            <p class="subtitle">${house.owner.name}</p>
            <p class="grey-2">${house.owner.address}</p>
          </div>
        </div>
      </div>
    `;
  }
}
