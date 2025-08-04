export function labelView(type) {
  if (type === "popular") {
    return `
      <span class="slider__image-label label label--popular">
        <svg class="btn__icon">
          <use xlink:href="img/icons/sprite.svg#fire"></use>
        </svg>
        Popular
      </span>
    `;
  } else if (type === "new") {
    return `
      <span class="slider__image-label label label--new-house">
        <svg class="btn__icon">
          <use xlink:href="img/icons/sprite.svg#House"></use>
        </svg>
        New house
      </span>
    `;
  } else if (type === "best") {
    return `
      <span class="slider__image-label label label--deals">
        <svg class="btn__icon">
          <use xlink:href="img/icons/sprite.svg#Wallet"></use>
        </svg>
        Best Deals
      </span>
    `;
  } else {
    return "WRONG TYPE";
  }
}
