export default class ColumnChart {
  element = null;
  columns = null;
  chartHeight = 50;
  constructor({
    data = [],
    label = '',
    value = 0,
    link = null}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    return this.createHTMLScheme(this.data, this.label, this.value, this.link);
  }
  update = ({data}) => {
    this.data = data;
    const newColumnChartChart = document.createElement('div');
    newColumnChartChart.classList.add('column-chart__chart');
    newColumnChartChart.dataset.v = 'body';
    for (const valueOfColumn of this.data) {
      const column = document.createElement('div');
      column.style.cssText = `--value: ${valueOfColumn}`;
      newColumnChartChart.append(column);
    }
    this.columns.replaceWith(newColumnChartChart);
  }
  createHTMLScheme = (data, label, value, link)=>{
    const columnСhart = document.createElement('div');
    columnСhart.classList.add('column-chart');
    columnСhart.style.cssText = '--chart-height: 50';

    const columnChartTitle = document.createElement('div');
    columnChartTitle.classList.add('column-chart__title');
    columnChartTitle.innerHTML = `Total ${label}`;
    columnСhart.append(columnChartTitle);
    const columnChartLink = document.createElement('a');
    columnChartLink.classList.add('column-chart__link');
    columnChartLink.innerHTML = 'View all';
    columnChartLink.href = `${link}`;
    columnChartTitle.append(columnChartLink);


    const columnChartContainer = document.createElement('div');
    columnChartContainer.classList.add('column-chart__container');
    columnСhart.append(columnChartContainer);
    const columnChartHeader = document.createElement('div');
    columnChartHeader.classList.add('column-chart__header');
    columnChartHeader.innerHTML = `${value}`;
    columnChartHeader.dataset.element = 'header';
    columnChartContainer.append(columnChartHeader);
    const columnChartChart = document.createElement('div');
    columnChartChart.classList.add('column-chart__chart');
    columnChartChart.dataset.v = 'body';
    columnChartContainer.append(columnChartChart);
    if (data.length === 0) {
      columnСhart.classList.add('column-chart_loading');
      const skeleton = document.createElement('img');
      skeleton.src = 'charts-skeleton.svg';
      columnChartChart.append(skeleton);
    } else {
      columnChartContainer.classList.remove("&::before");
      for (const valueOfColumn of data) {
        const column = document.createElement('div');
        column.style.cssText = `--value: ${valueOfColumn}`;
        columnChartChart.append(column);
      }
    }
    this.columns = columnChartChart;
    this.element = columnСhart;
  }
  destroy = ()=> this.element.remove();
  remove = () => this.element.remove();

}
