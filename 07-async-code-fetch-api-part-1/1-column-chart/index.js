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
    this.url = url,
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
    try {
      const response = await fetch(`https://course-js.javascript.ru/${this.url}?from=${from}&to=${to},`);
      this.dataJson = await response.json();
    } catch (error) {
      //console.warn(`Проблема с запросом на сервер: https://course-js.javascript.ru/${this.url}?from=${this.from}&to=${this.to}`);
    }
    const data = Object.values(this.dataJson);
    const maxValue = Math.max(...data);
    this.value = data.reduce((sum, current) => sum + current, 0);
    this.subElements.header.innerHTML = (this.formatHeading) ? this.formatHeading(this.value) : this.value;

    const scale = this.chartHeight / maxValue;
    this.subElements.body.innerHTML = data.map(columnHeight => {
      const value = Math.floor(columnHeight * scale);
      const percent = (columnHeight / maxValue * 100).toFixed(0);
      return `<div style="--value:${value}" data-tooltip="${percent}%"></div>`;
    }).join('');

    if (data.length) {this.element.classList.remove('column-chart_loading');}

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


