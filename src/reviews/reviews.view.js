import { View } from "../View.js";
import { debounce } from "../utility/debounce.js";

export class ReviewView extends View {
  _container = document.getElementById("slide-show");
  _containerDots = document.getElementById("review-dots");

  constructor() {
    super();
    this._container.addEventListener("scroll", () => {
      requestAnimationFrame(() => this._trackCenteredSlide());
    });
    const handleResize = () => {
      this._cacheSlideCenters();
      this._trackCenteredSlide();
    };

    window.addEventListener("resize", debounce(handleResize.bind(this), 200));

    this._containerDots.addEventListener(
      "click",
      this._handleDotsClicks.bind(this),
    );
  }

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._container.insertAdjacentHTML("afterbegin", markup);
    this._cacheSlideCenters();
    this._trackCenteredSlide();
  }

  _cacheSlideCenters() {
    const slides = this._container.querySelectorAll(".slide-show__item");
    this._slideCenters = Array.from(slides).map(
      (slide) => slide.offsetLeft + slide.offsetWidth / 2,
    );
  }

  _trackCenteredSlide() {
    const containerCenter =
      this._container.scrollLeft + this._container.offsetWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    this._slideCenters.forEach((slideCenter, i) => {
      const distance = Math.abs(slideCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });

    if (this._currentSlide !== closestIndex) {
      this._currentSlide = closestIndex;
      this._updateActiveDot(closestIndex);
    }
  }

  _updateActiveDot(index) {
    const dots = this._containerDots.querySelectorAll(".dots__dot");
    dots.forEach((dot) => dot.classList.remove("dots__dot--active"));
    const activeDot = dots[index];
    if (activeDot) {
      activeDot.classList.add("dots__dot--active");
    }
  }

  _handleDotsClicks(e) {
    const clickedButton = e.target.closest("button");
    if (!clickedButton || !this._containerDots.contains(clickedButton)) {
      return;
    }
    const slideIndex = Number(clickedButton.dataset.slide);
    this.scrollToIndex(slideIndex);
  }

  scrollToIndex(index, behavior = "smooth") {
    const containerWidth = this._container.offsetWidth;
    const targetCenter = this._slideCenters[index];
    const scrollLeft = targetCenter - containerWidth / 2;

    this._container.scrollTo({
      left: scrollLeft,
      behavior: behavior,
    });
    this._currentSlide = index;
    this._updateActiveDot(index);
  }

  _generateDots(quantity) {
    this._containerDots.innerHTML = "";
    const dotsHTML = Array.from({ length: quantity }, (_, i) =>
      this._generateDot(i),
    ).join("");
    this._containerDots.insertAdjacentHTML("afterbegin", dotsHTML);
  }

  _generateDot(number) {
    return `<button class="dots__dot" data-slide="${number}" aria-label="Slide ${number}"></button>`;
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
          loading="lazy"
        />
        <div class="slide-show__container-review">
          <h3 class="h-3 review__title">
            ${review.title}
          </h3>
          <p class="review__text label-md grey-3">
            ${review.text}
          </p>
          <div class="review__user">
            <div class="review__info">
              <img
                src="${review.user.avatar}"
                alt="${review.user.name}"
                class="contact-info__image"
                loading="lazy"
              />
              <span>
                <p class="label-semi-bold">${review.user.name}</p>
                <p class="label-sm grey-2">${review.user.location}</p>
              </span>
            </div>
            <div class="rating">
              <svg class="rating__icon">
                <use href="img/icons/sprite.svg#Star"></use>
              </svg>
              <h4 class="h-4">${review.rating}</h4>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
