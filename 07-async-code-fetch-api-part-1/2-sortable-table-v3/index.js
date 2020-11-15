import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

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
    this.sorted.id = this.defaultId = id;
    this.sorted.order = this.defaultOrder = order;

    const sortingOrder = order === 'asc' ? 'desc' : 'asc';
    column.dataset.order = sortingOrder;
    column.append(this.subElements.arrow);
    this.update(id, sortingOrder);
  }

   tryToAddRows = async () => {
     let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
     if ((windowRelativeBottom <= document.documentElement.clientHeight + 100) && !this.isLoading && !this.isSortLocally) {
       this.isLoading = true;
       await this.addRows();
       this.isLoading = false;
     }
   }

   clearFilters = () => {
     this.update(this.defaultId, this.defaultOrder);
   }


   constructor(headersConfig, {
     url = '',
     sorted = {
       id: headersConfig.find(item => item.sortable).id,
       order: 'asc',
     },
     isSortLocally = false,
   } = {},
   ) {
     this.sorted = sorted;
     const id = sorted.id;
     const order = sorted.order;
     this.isSortLocally = isSortLocally;
     this.url = new URL(url, BACKEND_URL),
     this.headersConfig = headersConfig;
     this.render(id, order);
   }

   async render(id = this.sorted.id, order = this.sorted.order) {
     this.element = this.tableTemplate;
     this.subElements = this.getSubElements(this.element);
     await this.update(id, order);
     this.initEventListeners();
   }

   get tableTemplate() {
     const wrapper = document.createElement('div');
     wrapper.innerHTML = `<div class="sortable-table">
                              ${this.tableHeader}
                              <div data-element="body" class="sortable-table__body"></div>
                              <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
                              <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                                  <div>
                                    <p>Не найдено товаров удовлетворяющих выбранному критерию</p>
                                    <button data-element="clearButton" type="button" class="button-primary-outline">Очистить фильтры</button>
                                  </div>
                              </div>
                         </div>`;
     return wrapper.firstElementChild;
   }

   async update(id = this.sorted.id, order = this.sorted.order) {
     this.isLoading = true;
     this.element.classList.add('sortable-table_loading');
     this.subElements.body.innerHTML = '';

     this.start = 0;
     this.end = 30;
     if (this.isSortLocally) {
       this.sortedData = this.sortLocally(id, order);
       this.subElements.body.innerHTML = this.getTableRows(this.sortedData);
     }
     else {
       this.sortedData = await this.sortOnServer(id, order, this.start, this.end);
       if (this.sortedData.length !== 0) {
         this.subElements.body.innerHTML = this.getTableRows(this.sortedData);
       } else {
         this.element.classList.add('sortable-table_empty');
       }
     }
     this.element.classList.remove('sortable-table_loading');
     this.isLoading = false;
   }

   async addRows() {
     this.start += 30;
     this.end += 30;
     const {id, order} = this.sorted;
     const sortedData = await fetchJson(this.urlWithAllSearchParams(id, order));
     this.subElements.body.insertAdjacentHTML("beforeend", this.getTableRows(sortedData));
   }

   async sortOnServer(id = this.defaultId, order = this.defaultOrder) {
     return fetchJson(this.urlWithAllSearchParams(id, order));
   }
   urlWithAllSearchParams(id, order, start = this.start, end = this.end) {
     this.url.searchParams.set(`_sort`, id);
     this.url.searchParams.set(`_order`, order);
     this.url.searchParams.set(`_start`, start);
     this.url.searchParams.set(`_end`, end);
     return this.url;
   }

   sortLocally(field, order) {
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

   initEventListeners() {
     this.subElements.header.addEventListener('pointerdown', this.sortByClick);
     window.addEventListener('scroll', this.tryToAddRows);
     this.subElements.clearButton.addEventListener('pointerdown', this.clearFilters);
   }

   get tableHeader() {
     return `<div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headersConfig.map(item => this.getCellForHeaderColumn(item)).join('')}
            </div>`;
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

