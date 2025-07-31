export class View {
  constructor() {}

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    this._clear();
    this._container.insertAdjacentHTML("afterbegin", markup);
  }

  subscribe(eventType, listener) {
    if (!this._listeners[eventType]) {
      this._listeners[eventType] = [];
    }
    this._listeners[eventType].push(listener);
  }

  _notify(eventType, payload) {
    if (!this._listeners[eventType]) return;
    this._listeners[eventType].forEach((listener) => listener(payload));
  }

  _clear() {
    this._container.innerHTML = "";
  }
}
