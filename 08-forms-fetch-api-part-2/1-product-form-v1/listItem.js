export default class ListItem {
  constructor ({url, source}) {
    this.url = url;
    this.source = source;
    this.elementHTML = this.render();
  }
  render() {
    return this.template;

  }
  get template() {
    return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
            <input type="hidden" name="url" value="${this.url}">
            <input type="hidden" name="source" value="${this.source}">
            <span>
              <img src="icon-grab.svg" data-grab-handle="" alt="grab">
              <img class="sortable-table__cell-img" alt="Image" src="${this.url}">
              <span>${this.source}</span>
            </span>
            <button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
            </button>
        </li>`;

  }

  remove () {
    this.elementHTML.remove();
  }

  destroy() {
    this.columns = null;
    this.elementHTML.remove();
  }
}
