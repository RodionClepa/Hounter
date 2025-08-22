import { EventBus } from "../EventBus.js";
import { View } from "../View.js";

export class ArticlesView extends View {
  _container = document.getElementById("blogs__list");
  _buttonMoreArticles = document.getElementById("more-articles");
  eventTypes = {
    moreArticlesPressed: "moreArticlesPressed",
    articleClicked: "articleClicked",
  };

  constructor() {
    super();
    this.eventBus = new EventBus(this.eventTypes);
    this._buttonMoreArticles.addEventListener("click", () =>
      this.eventBus.notify(this.eventTypes.moreArticlesPressed),
    );

    this._container.addEventListener(
      "click",
      this._handleArticleClicks.bind(this),
    );
    this.DELAY_ITEM = 500;
  }

  setActive(id) {
    this.eventBus.notify(this.eventTypes.articleClicked, id);
    this._setActiveArticle(id);
  }

  subscribe(eventType, listener) {
    this.eventBus.subscribe(eventType, listener);
  }

  async appendEnd(data) {
    for (const article of data) {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = this._generateItem(article).trim();
      const item = wrapper.firstElementChild;

      item.classList.add("blogs__item--invisible");
      this._container.appendChild(item);
      item.scrollIntoView({ behavior: "smooth" });

      await new Promise(requestAnimationFrame);

      requestAnimationFrame(() => {
        item.classList.remove("blogs__item--invisible");
      });

      await new Promise((resolve) => setTimeout(resolve, this.DELAY_ITEM));
    }
  }

  _handleArticleClicks(e) {
    const clickedButton = e.target.closest("button");

    if (!clickedButton) return;

    const id = clickedButton.dataset.id;
    this.eventBus.notify(this.eventTypes.articleClicked, id);
    this._setActiveArticle(id);
  }

  _setActiveArticle(id) {
    const articlesEl = this._container.querySelectorAll(".blogs__item");
    articlesEl.forEach((article) => {
      article.classList.toggle(
        "active",
        article.querySelector("button").dataset.id === id,
      );
    });
  }

  _generateMarkup() {
    return this._data.map((article) => this._generateItem(article)).join("");
  }

  _generateItem(article) {
    return `
      <li class="blogs__item">
        <button class="blog" data-id="${article.id}">
          <img
            src="${article.image}"
            alt="${article.text}"
            class="blog__image"
            loading="lazy"
          />
          <div class="blog__info">
            <div class="user">
              <img
                src="${article.author.avatar}"
                alt="${article.author.name}"
                class="user__avatar"
                loading="lazy"
              />
              <p class="label-semibold grey-3">${article.author.name}</p>
            </div>
            <p class="subtitle">
              ${article.title}
            </p>
            <div class="blog__time">
              <svg class="blog__clock-icon">
                <use href="img/icons/sprite.svg#Clock"></use>
              </svg>
              ${article.readTime} min read | ${this._formateDate(article.date)}
            </div>
          </div>
        </button>
      </li>            
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
