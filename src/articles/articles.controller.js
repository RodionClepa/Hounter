import { ArticlePreviewView } from "./articlePreview.view.js";
import { ArticlesModel } from "./articles.model.js";
import { ArticlesView } from "./articles.view.js";

export class ArticlesController {
  data = [];
  _moreArticlesPressed = false;
  constructor() {
    this.model = new ArticlesModel();
    this.view = new ArticlesView();
    this.preview = new ArticlePreviewView();

    this.model.subscribe(this.model.eventTypes.dataChange, (data) => {
      this.data = data;
      this.view.render(this.data.slice(0, 3));
      this.preview.render(this.data[0]);
    });

    this.view.subscribe(this.view.eventTypes.moreArticlesPressed, () => {
      if (this._moreArticlesPressed) {
        return;
      }
      this._moreArticlesPressed = true;
      this.view.appendEnd(this.data.slice(3));
    });

    this.view.subscribe(this.view.eventTypes.articleClicked, (id) => {
      this.preview.update(this.data[parseInt(id)]);
    });

    this.model.fetchData().catch((err) => {
      console.error("Failed to load articles:", err);
      this.view.render([]);
    });
  }
}
