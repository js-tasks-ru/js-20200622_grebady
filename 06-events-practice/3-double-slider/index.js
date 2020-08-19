export default class DoubleSlider {
  element; // HTMLElement;

  leftThumb; // HTMLElement;
  rightThumb; // HTMLElement;
  sliderWidth;//Num
  sliderLeft;
  sliderProgress; // HTMLElement;
  dragging; //current thumb

  from;
  to;
  min;
  max;
  formatValue; //function
  selected;




  onMouseDown = event => {
    this.getInitialPosition();
    event.preventDefault();

    let leftThumbFromEvent = event.target.closest('.range-slider__thumb-left');
    if (leftThumbFromEvent === this.leftThumb) {
      this.dragging = this.leftThumb;
      const { right } = this.dragging.getBoundingClientRect();
      this.shiftX = right - event.clientX;
      this.element.classList.add('range-slider_dragging');
      document.addEventListener('pointermove', this.onMouseMove);
      document.addEventListener('pointerup', this.onMouseUp);
    }

    let rightThumbFromEvent = event.target.closest('.range-slider__thumb-right');
    if (rightThumbFromEvent) {
      this.dragging = this.rightThumb;
      const { left } = this.dragging.getBoundingClientRect();
      this.shiftX = left - event.clientX;
      this.element.classList.add('range-slider_dragging');
      document.addEventListener('pointermove', this.onMouseMove);
      document.addEventListener('pointerup', this.onMouseUp);
    }
  };
  onMouseMove = event => {

    if (this.dragging === this.leftThumb) {
      let newLeft = (event.clientX - this.sliderLeft + this.shiftX) / this.sliderWidth;

      if (newLeft < 0) {
        newLeft = 0;
      }
      newLeft *= 100;
      let right = parseFloat(this.rightThumb.style.right);

      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }

      this.dragging.style.left = `${newLeft}%`;
      this.sliderProgress.style.left = `${newLeft}%`;
      const rangeTotal = this.max - this.min;
      this.selected.from = Math.round(this.min + (rangeTotal * newLeft) / 100);
      this.spanFrom.innerHTML = this.formatValue(this.selected.from);
    }


    if (this.dragging === this.rightThumb) {

      let newRight = (this.sliderRight - event.clientX - this.shiftX) / this.sliderWidth;

      if (newRight < 0) {
        newRight = 0;
      }
      newRight *= 100;

      let left = parseFloat(this.leftThumb.style.left);

      if (left + newRight > 100) {
        newRight = 100 - left;
      }

      this.dragging.style.right = `${newRight}%`;
      this.sliderProgress.style.right = `${newRight}%`;
      const rangeTotal = this.max - this.min;
      this.selected.to = Math.round(this.min + (rangeTotal * (100 - newRight)) / 100);
      this.spanTo.innerHTML = this.formatValue(this.selected.to);
    }
  };
  onMouseUp = () => {
    const customEvent = new CustomEvent('range-select', {
      bubbles: true,
      detail: {
        from: this.selected.from,
        to: this.selected.to
      }
    });

    this.element.dispatchEvent(customEvent);
    this.element.classList.remove('range-slider_dragging');
    this.removeListeners();
  };


  constructor({
    min = 100,
    max = 200,
    formatValue = value => '$' + value,
    selected = {
      from: min,
      to: max,
    }
  } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
    this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
    this.element.addEventListener('pointerdown', this.onMouseDown);

  }

  getInitialPosition() {
    this.sliderInner = this.element.querySelector('.range-slider__inner');
    this.sliderLeft = this.sliderInner.getBoundingClientRect().left;
    this.sliderRight = this.sliderInner.getBoundingClientRect().right;
    this.sliderWidth = this.sliderInner.getBoundingClientRect().width;
    this.sliderProgress = this.element.querySelector('.range-slider__progress');
    this.spanFrom = this.element.querySelector('[data-element="from"]');
    this.spanTo = this.element.querySelector('[data-element="to"]');
  }

  render() {
    const element = document.createElement('div');
    const rangeTotal = this.max - this.min;
    const left = Math.floor((this.selected.from - this.min) / (rangeTotal) * 100);
    const right = Math.floor((this.max - this.selected.to) / (rangeTotal) * 100);

    const {from, to} = this.selected;

    element.innerHTML = `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(from)}</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left: ${left}%; right: ${right}%"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${left}%"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${right}%"></span>
        </div>
        <span data-element="to">${this.formatValue(to)}</span>
      </div>
    `;

    this.element = element.firstElementChild;
    this.element.ondragstart = () => false;
    this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
    this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
  }

  remove() {
    this.element.remove();
  }

  removeListeners () {
    document.removeEventListener('pointerup', this.onMouseUp);
    document.removeEventListener('pointermove', this.onMouseMove);
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }
}
