export class RecommendationController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.subscribe((data) => this.view.render(data));

    this.model.fetchData().catch((err) => {
      console.error("Failed to load recommendations:", err);
      this.view.render([]);
    });
  }
}
