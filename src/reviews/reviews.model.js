export class Review {
  eventTypes = {
    dataChange: "changeData",
  };

  constructor() {
    this._data = [];
    this._listeners = [];
  }
}
