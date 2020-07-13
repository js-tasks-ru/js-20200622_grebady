export default class ColumnChart {
  element; // HTMLElement;
  columns;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
  }) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.render();
    this.initEventListeners();
  }

  initEventListeners() {}

  render() {
    this.element = this.templateAndInitColumns;
    this.update();
  }
  get templateAndInitColumns() {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="column-chart ${(this.data.length === 0) ? 'column-chart_loading' : ''}" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${ (this.link) ? `<a class="column-chart__link" href="${this.link}">View all</a>` : ''}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
          ${this.value}
        </div>
        <div data-element="body" class="column-chart__chart">

        </div>
      </div>
    </div>
    `;
    this.columns = div.querySelector('.column-chart__chart');
    return div.firstElementChild;
  }
  update(data = this.data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    this.columns.innerHTML = '';
    for (const columnHeight of data) {
      const value = Math.floor(columnHeight * scale);
      const percent = (columnHeight / maxValue * 100).toFixed(0);
      this.columns.innerHTML +=
        `<div style="--value:${value}" data-tooltip="${percent}%"></div>`;
    }
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.columns = null;
    this.element.remove();
    // additionally needed to remove all listeners...
  }
}

// const defaultComponent = new DefaultComponent();
// const element = document.getElementById('root');
//
// element.append(defaultComponent.element);
