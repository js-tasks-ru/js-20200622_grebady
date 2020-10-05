export default class ColumnChart {
  element; // HTMLElement;
  columns;
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.render();
  }

  render() {
    this.element = this.templateAndInitColumns;
    this.update();
  }
  get templateAndInitColumns() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
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
    this.columns = wrapper.querySelector('.column-chart__chart');
    return wrapper.firstElementChild;
  }
  update({data} = {}) {
    if (data === undefined) {data = this.data;}
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    this.columns.innerHTML = '';
    let divs = '';
    for (const columnHeight of data) {
      const value = Math.floor(columnHeight * scale);
      const percent = (columnHeight / maxValue * 100).toFixed(0);
      divs += `<div style="--value:${value}" data-tooltip="${percent}%"></div>`;
    }
    this.columns.innerHTML = divs;
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.columns = null;
    this.element.remove();
  }
}


