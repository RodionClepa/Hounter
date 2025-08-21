import { View } from "../View.js";

export class ArticlePreviewView extends View {
  _container = document.getElementById("blog__preview");

  constructor() {
    super();
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = Array.from(this._container.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value),
        );
    });
  }

  _generateMarkup() {
    return `
      <img
        src="${this._data.image}"
        alt="${this._data.title}"
        class="blog__preview-image"
      />
      <div class="user">
        <img
          src="${this._data.author.avatar}"
          alt="${this._data.author.name}"
          class="user__avatar"
        />
        <p class="label-semibold grey-3">${this._data.author.name}</p>
      </div>

      <h3 class="h-3">
       ${this._data.title} 
      </h3>
      <p class="grey-3">
        ${this._data.text}
      </p>
      <div class="blog__preview-time">
        <svg class="blog__clock-icon">
          <use xlink:href="img/icons/sprite.svg#Clock"></use>
        </svg>
        ${this._data.readTime} min read | ${this._formateDate(this._data.date)}
      </div>
    `;
  }

  _formateDate(inputDate) {
    return new Date(inputDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
}
