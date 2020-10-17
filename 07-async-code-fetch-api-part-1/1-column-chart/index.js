import fetchJson from './utils/fetch-json.js';
const BACKEND_URL = 'https://course-js.javascript.ru';
export default class ColumnChart {
  element; // HTMLElement;
  subElements; //HTMLElements;
  columns;
  chartHeight = 50;

  constructor({
    url = '',
    label = '',
    range = {
      from: Date.now(),
      to: Date.now(),
    },
    link = '',
    formatHeading = data => data,
  } = {}) {
    this.url = new URL(url, BACKEND_URL),
    this.from = range.from,
    this.to = range.to,
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading,
    this.render();
    this.subElements = this.getSubElements(this.element);
  }

  render() {
    this.element = this.templateAndInitColumns;
    this.update(this.from, this.to);
  }

  get templateAndInitColumns() {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${ (this.link) ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
        </div>
        <div data-element="body" class="column-chart__chart">

        </div>
      </div>
    </div>
    `;
    return div.firstElementChild;
  }

  async update(from = Date.now() - Date.now().setMonth(Date.now().getMonth() - 1), to = Date.now()) {
    this.element.classList.add('column-chart_loading');

    this.url.searchParams.set(`from`, from.toString());
    this.url.searchParams.set(`to`, to.toString());
    this.dataJson = await fetchJson(this.url);

    const data = Object.values(this.dataJson);
    this.value = data.reduce((sum, current) => sum + current, 0);
    this.subElements.header.innerHTML = (this.formatHeading) ? this.formatHeading(this.value) : this.value;
    this.subElements.body.innerHTML = this.updateBody(data);

    if (data.length) {this.element.classList.remove('column-chart_loading');}
  }

  updateBody(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;
    return data.map(columnHeight => {
      const value = Math.floor(columnHeight * scale);
      const percent = (columnHeight / maxValue * 100).toFixed(0);
      return `<div style="--value:${value}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.columns = null;
    this.element.remove();
  }
}


