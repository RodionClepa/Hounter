export class DraggableSlider {
  constructor(container, item) {
    this._slider = document.querySelector(container);
    this._profileCard = this._slider.querySelector(item);

    this._pointerPosition = 0;
    this._sliderScrollLeft = 0;
    this._isDrag = false;

    this._cardWidth = this._profileCard.offsetWidth;
    this._spaceBetween =
      parseInt(window.getComputedStyle(this._slider).gap) || 0;
    this._currentCard = 0;

    this._slider.addEventListener("mousedown", this._start.bind(this));
    this._slider.addEventListener("mousemove", this._drag.bind(this));
    this._slider.addEventListener("mouseup", this._stop.bind(this));
    this._slider.addEventListener("mouseleave", this._stop.bind(this));

    this._scrollTimeout = null;
    this._slider.addEventListener("scroll", this._onScroll.bind(this));
  }

  _start(event) {
    this._isDrag = true;
    this._pointerPosition = event.pageX;
    this._sliderScrollLeft = this._slider.scrollLeft;
    this._slider.classList.add("drag");
  }

  _drag(event) {
    if (!this._isDrag) return;
    this._slider.scrollLeft =
      this._sliderScrollLeft - (event.pageX - this._pointerPosition);
    console.log(maxScrollLeft);
    console.log(this._slider.scrollLeft);
  }

  getMaxScrollLeft() {
    return this._slider.scrollWidth - this._slider.clientWidth;
  }

  _stop() {
    this._isDrag = false;
    let snappedPosition = 0;
    const maxScrollLeft = this.getMaxScrollLeft();
    if (maxScrollLeft - 100 <= this._slider.scrollLeft) {
      snappedPosition = maxScrollLeft;
    } else {
      this._updateCurrentCard();
      snappedPosition = this.getSnappedPosition();
    }
    this.smoothScroll(snappedPosition);
    this._slider.classList.remove("drag");
  }

  getSnappedPosition() {
    return this._currentCard * (this._cardWidth + this._spaceBetween);
  }

  smoothScroll(position) {
    this._slider.scrollTo({
      left: position,
      behavior: "smooth",
    });
  }

  _onScroll() {
    if (this._scrollTimeout) return;

    this._scrollTimeout = setTimeout(() => {
      this._updateCurrentCard();
      this._scrollTimeout = null;
    }, 100);
  }

  _updateCurrentCard() {
    const totalCardWidth = this._cardWidth + this._spaceBetween;
    this._currentCard = Math.round(this._slider.scrollLeft / totalCardWidth);
  }

  getCardWidth() {
    return this._cardWidth;
  }

  getSpaceBetween() {
    return this._spaceBetween;
  }

  getCurrentCard() {
    return this._currentCard;
  }

  destroy() {
    this._slider.removeEventListener("mousedown", this._start);
    this._slider.removeEventListener("mousemove", this._drag);
    this._slider.removeEventListener("mouseup", this._stop);
    this._slider.removeEventListener("mouseleave", this._stop);
    this._slider.removeEventListener("scroll", this._onScroll);
  }
}
