import { EventBus } from "../EventBus.js";

export class DraggableSlider {
  eventTypes = {
    currentCardUpdated: "currentCardUpdated",
  };

  constructor(container, item) {
    this._slider = document.querySelector(container);
    if (!this._slider) {
      throw new Error(`Container '${container}' not found`);
    }
    this._sliderItem = this._slider.querySelector(item);
    if (!this._sliderItem) {
      throw new Error(`Item '${item}' not found in container`);
    }

    this._itemClass = item;

    this._pointerPosition = 0;
    this._sliderScrollLeft = 0;
    this._isDrag = false;

    this._cardWidth = this._sliderItem.offsetWidth;
    this._spaceBetween =
      parseInt(window.getComputedStyle(this._slider).gap) || 0;
    this._currentCard = 0;

    this._startHandler = this._start.bind(this);
    this._dragHandler = this._drag.bind(this);
    this._stopHandler = this._stop.bind(this);
    this._onScrollHandler = this._onScroll.bind(this);
    this._scrollTimeout = null;

    this._slider.addEventListener("mousedown", this._startHandler);
    this._slider.addEventListener("mousemove", this._dragHandler);
    this._slider.addEventListener("mouseup", this._stopHandler);
    this._slider.addEventListener("mouseleave", this._stopHandler);
    this._slider.addEventListener("scroll", this._onScrollHandler);
    this._DELAYSCROLL = 500;

    this.eventBus = new EventBus(this.eventTypes);
  }

  _start(event) {
    this._isDrag = true;
    this._pointerPosition = event.pageX;
    this._sliderScrollLeft = this._slider.scrollLeft;
    this._slider.classList.add("drag");
  }

  _drag(event) {
    if (!this._isDrag) {
      return;
    }
    this._slider.scrollLeft =
      this._sliderScrollLeft - (event.pageX - this._pointerPosition);
  }

  _getMaxScrollLeft() {
    return this._slider.scrollWidth - this._slider.clientWidth;
  }

  _getMaxCardFit() {
    return Math.trunc(
      this._slider.clientWidth / (this._cardWidth + this._spaceBetween),
    );
  }

  _stop() {
    if (!this._isDrag) {
      return;
    }
    this._moveToSnappedPosition();

    this._isDrag = false;
    this._slider.classList.remove("drag");
  }

  isEnd() {
    return this._currentCard === this._countItems() - 1;
  }

  _moveToSnappedPosition() {
    let snappedPosition;
    this._updateCurrentCard();

    if (this.isEnd()) {
      snappedPosition = this._getMaxScrollLeft();
    } else {
      snappedPosition = this._getSnappedPosition();
    }

    this._smoothScroll(snappedPosition);
  }

  scrollNext() {
    this._currentCard =
      this._currentCard < this._countItems()
        ? this._currentCard + 1
        : this._countItems();
    const newPos = this._getSnappedPosition();
    this._smoothScroll(newPos);
  }

  scrollPrev() {
    this._currentCard = Math.max(this._currentCard - 1, 0);
    const newPos = this._getSnappedPosition();
    this._smoothScroll(newPos);
  }

  scrollStart() {
    this._smoothScroll(0);
  }

  _getSnappedPosition() {
    return this._currentCard * (this._cardWidth + this._spaceBetween);
  }

  _smoothScroll(position) {
    this._systemScroll = true;
    this._slider.scrollTo({
      left: position,
      behavior: "smooth",
    });

    setTimeout(() => {
      this._systemScroll = false;
      this._updateCurrentCard();
    }, this._DELAYSCROLL);
  }

  _onScroll() {
    if (this._isDrag || this._systemScroll) {
      return;
    }
    clearTimeout(this._scrollTimeout);

    this._scrollTimeout = setTimeout(() => {
      this._updateCurrentCard();
      this._moveToSnappedPosition();
      this._scrollTimeout = null;
    }, 100);
  }

  _countItems() {
    const items = this._slider.querySelectorAll(this._itemClass);
    return items.length;
  }

  _updateCurrentCard() {
    const totalCardWidth = this._cardWidth + this._spaceBetween;
    const scrollPosition = this._slider.scrollLeft / totalCardWidth;
    const maxVisibleStartIndex = this._countItems() - this._getMaxCardFit();

    if (Math.ceil(scrollPosition) === maxVisibleStartIndex) {
      this._currentCard = Math.ceil(scrollPosition);
    } else {
      this._currentCard = Math.round(scrollPosition);
    }

    this.eventBus.notify(this.eventTypes.currentCardUpdated);
  }

  getCurrentCard() {
    return this._currentCard;
  }

  subscribe(eventType, listener) {
    this.eventBus.subscribe(eventType, listener);
  }

  destroy() {
    this._slider.removeEventListener("mousedown", this._startHandler);
    this._slider.removeEventListener("mousemove", this._dragHandler);
    this._slider.removeEventListener("mouseup", this._stopHandler);
    this._slider.removeEventListener("mouseleave", this._stopHandler);
    this._slider.removeEventListener("scroll", this._onScrollHandler);
  }
}

export const draggableSlider = new DraggableSlider(
  ".slider__container",
  ".slider__item",
);
