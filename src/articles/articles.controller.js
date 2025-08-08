import { ArticlesModel } from "./articles.model.js";
import { ArticlesView } from "./articles.view.js";

export class ArticlesController {
  data = [];
  constructor() {
    this.model = new ArticlesModel();
    this.view = new ArticlesView();

    this.model.subscribe(this.model.eventTypes.dataChange, (data) => {
      this.data = data;
      this.view.render(this.data.slice(0, 3));
    });

    this.view.subscribe(this.view.eventTypes.moreArticlesPressed, () => {
      this.view.appendEnd(this.data.slice(3));
    });

    this.view.subscribe(this.view.eventTypes.articleClicked, (id) => {
      console.log(parseInt(id));
    });

    this.model.fetchData().catch((err) => {
      console.error("Failed to load articles:", err);
      this.view.render([]);
    });
  }
}
