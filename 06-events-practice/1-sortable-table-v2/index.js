export default class SortableTable {
  element;
  subElements = {};
  headersConfig = [];
  data = [];
  sorted = {};

  sortByClick = event =>{
    const column = event.target.closest('[data-sortable="true"]');

    if (!column) {return;}

    const { id, order } = column.dataset;
    const sortingOrder = order === 'asc' ? 'desc' : 'asc';
    const sortedData = this.sortData(id, sortingOrder);
    column.dataset.order = sortingOrder;
    column.append(this.subElements.arrow);
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }


  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc',
    }
  } = {},
  ) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.render();
  }

  render() {
    const {id, order} = this.sorted;
    const wrapper = document.createElement('div');
    const sortedData = this.sortData(id, order);
    wrapper.innerHTML = this.getTable(sortedData);

    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();
  }

  sortData(field, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === field);
    const {sortType, customSorting} = column;
    const direction = (order === 'asc') ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[field] - b[field]);
      case 'string':
        return direction * a[field].localeCompare(b[field], 'ru');
      case 'custom':
        return direction * customSorting(a, b);
      default:
        return direction * (a[field] - b[field]);
      }
    });
  }

  getTable(data) {
    return `
     <div class="sortable-table">
          ${this.tableHeader}
          ${this.getTableBody(data)}
     </div>
   `;
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sortByClick);
  }

  get tableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.headersConfig.map(item => this.getCellForHeaderColumn(item)).join('')}</div>`;
  }

  getCellForHeaderColumn({id, title, sortable}) {
    const order = (this.sorted.id === id) ? this.sorted.order : 'asc';
    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" ${(sortable) ? `data-order="${order}"` : ""}>
            <span>${title}</span>
            ${this.getArrowForSortingColumn(id)}
        </div>`;
  }

  getArrowForSortingColumn(id) {
    const isOrderExist = (this.sorted.id === id) ? this.sorted.order : '';

    return (isOrderExist) ?
      `<span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>` : "";
  }

  getTableBody(data) {
    return `
   <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
      </div>`;
  }

  getTableRows(data) {
    return data.map(item => `
     <div class="sortable-table__row">
        ${this.getTableRow(item)}
     </div>
   `).join('');
  }

  getTableRow(item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });
    return cells.map(({id, template}) => {
      return (template) ?
        template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }



  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('mousedown', this.sortByClick);
    this.subElements = {};
  }
}
