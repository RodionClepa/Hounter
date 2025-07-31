import { labelView } from "../services/label-view.service.js";

export class RecommendationView {
  constructor(containerId) {
    this._container = document.getElementById(containerId);
  }

  render(data) {
    console.log("render");
    if (!data || data.length === 0) {
      this._container.innerHTML = "<p>No recommendations available.</p>";
      return;
    }

    this._clear();

    const markup = data.map((house) => this._generateMarkup(house)).join("");
    console.log(markup);

    this._container.insertAdjacentHTML("afterbegin", markup);
  }

  _generateMarkup(house) {
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

  _formatMoney(amount) {
    return "$ " + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  _clear() {
    this._container.innerHTML = "";
  }
}
