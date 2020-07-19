export default class SortableTable {
  element;
  subElements = {};
  headersConfig = [];
  data = [];

  sortByClick = event =>{
    const column = event.target.closest('.sortable-table__cell');
    if (event.target.closest('[data-sortable="true"]')) {

      const field = column.dataset.id;
      const sortedData = (column.dataset.order) === 'desc' ? this.sort(field, 'asc') : this.sort(field, 'desc');
      // this.subElements.innerHTML = this.getTableRows(sortedData);
    }
  }
  constructor(headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'desc',
    }
  } = {},
  ) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.render();
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sortByClick);
  }

  get tableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}</div>`;
  }

  getHeaderRow({id, title, sortable}) {
    return `<div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
            <span>${title}</span>
            ${this.headerSortingString}
        </div>`;
  }

  get headerSortingString() {
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>`;
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
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }


  getTable(data) {
    return `
     <div class="sortable-table">
          ${this.tableHeader}
          ${this.getTableBody(data)}
     </div>
   `;
  }

  render() {
    const $wrapper = document.createElement('div');
    $wrapper.innerHTML = this.getTable(this.data);
    this.element = $wrapper.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.initEventListeners();
    this.sort(this.sorted.id, this.sorted.order);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    let accum = {};
    for (let i = 0; i < elements.length; i++) {
      accum[elements[i].dataset.element] = elements[i];
    }
    return accum;
  }

  // getSubElements(element) {
  //   const elements = element.querySelectorAll('[data-element]');
  //
  //   return [...elements].reduce((accum, subElement) => {
  //     accum[subElement.dataset.element] = subElement;
  //
  //     return accum;
  //   }, {});
  // }

  sort(field, order) {
    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
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

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('mousedown', this.sortByClick);
    this.subElements = {};
  }
}
