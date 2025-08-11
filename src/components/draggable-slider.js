import { EventBus } from "../EventBus.js";

export class DraggableSlider {
  eventTypes = {
    currentCardUpdated: "currentCardUpdated",
  };

  constructor(containerSelector, itemSelector) {
    this._slider = document.querySelector(containerSelector);
    if (!this._slider) {
      throw new Error(`Container '${containerSelector}' not found`);
    }

    this._sliderItem = this._slider.querySelector(itemSelector);
    if (!this._sliderItem) {
      throw new Error(`Item '${itemSelector}' not found in container`);
    }

    this._itemClass = itemSelector;

    this._pointerPosition = 0;
    this._sliderScrollLeft = 0;
    this._isDrag = false;

    this._cardWidth = this._sliderItem.offsetWidth;
    this._style = window.getComputedStyle(this._slider);
    this._spaceBetween = parseInt(this._style.gap) || 0;
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
    const delta = event.pageX - this._pointerPosition;
    this._slider.scrollLeft = this._sliderScrollLeft - delta;
  }

  _stop() {
    if (!this._isDrag) {
      return;
    }
    this._moveToSnappedPosition();
    this._isDrag = false;
    this._slider.classList.remove("drag");
  }

  _getMaxScrollLeft() {
    return this._slider.scrollWidth - this._slider.clientWidth;
  }

  _getMaxVisibleCards() {
    return Math.trunc(
      this._slider.clientWidth / (this._cardWidth + this._spaceBetween),
    );
  }

  _getPaddingStart() {
    return parseInt(this._style.paddingInlineStart) || 0;
  }

  _getPaddingEnd() {
    return parseInt(this._style.paddingInlineEnd) || 0;
  }

  isEnd() {
    return (
      this._slider.scrollLeft > this._getMaxScrollLeft() - this._getPaddingEnd()
    );
  }

  isStart() {
    console.log(
      `${this._slider.scrollLeft} < ${this._getPaddingStart()} + ${this._cardWidth / 3}`,
    );
    return this._slider.scrollLeft < this._cardWidth / 2;
  }

  _moveToSnappedPosition() {
    let snappedPosition;
    this._updateCurrentCard();

    if (this.isEnd()) {
      snappedPosition = this._getMaxScrollLeft();
    } else if (this.isStart()) {
      snappedPosition = 0;
    } else {
      snappedPosition = this._getSnappedPosition();
    }

    this._smoothScroll(snappedPosition);
  }

  scrollNext() {
    console.log(this._currentCard);
    this._currentCard = Math.min(this._currentCard + 1, this._countItems() - 1);
    console.log(this._currentCard);
    this._smoothScroll(this._getSnappedPosition());
  }

  scrollPrev() {
    this._currentCard = Math.max(this._currentCard - 1, 0);
    this._smoothScroll(this._getSnappedPosition());
  }

  scrollStart() {
    this._smoothScroll(0);
  }

  _getSnappedPosition() {
    if (this._currentCard === 0) {
      return 0;
    }
    const cardOffset = this._cardWidth + this._spaceBetween;
    return this._currentCard * cardOffset;
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
    return this._slider.querySelectorAll(this._itemClass).length;
  }

  _updateCurrentCard() {
    console.log("_updateCurrentCard");
    if (this.isStart()) {
      this._currentCard = 0;
      console.log("isStart");
    } else if (this.isEnd()) {
      console.log(`${this._countItems()} - ${this._getMaxVisibleCards()}`);
      this._currentCard = this._countItems() - this._getMaxVisibleCards();
      console.log("isEnd");
    } else {
      const offset = this._slider.scrollLeft;
      const totalCardWidth = this._cardWidth + this._spaceBetween;
      this._currentCard = Math.round(Math.abs(offset) / totalCardWidth);
    }
    console.log(this._currentCard);

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
