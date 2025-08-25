export class View {
  constructor() {}

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._container.insertAdjacentHTML("afterbegin", markup);
  }

  _clear() {
    this._container.innerHTML = "";
  }
}
