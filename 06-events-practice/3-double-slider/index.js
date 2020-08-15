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

  leftBoundary;
  rightBoundary;


  onMouseDown = event => {
    this.getInitialPosition();
    event.preventDefault();

    let leftThumbFromEvent = event.target.closest('.range-slider__thumb-left');
    if (leftThumbFromEvent === this.leftThumb) {
      this.leftBoundary = this.sliderLeft;
      this.rightBoundary = this.rightThumb.getBoundingClientRect().left - this.sliderLeft;
      this.dragging = this.leftThumb;
      const { right } = this.dragging.getBoundingClientRect();
      this.shiftX = right - event.clientX;
      this.element.classList.add('range-slider_dragging');
      document.addEventListener('pointermove', this.onMouseMove);
      document.addEventListener('pointerup', this.onMouseUp);
    }

    let rightThumbFromEvent = event.target.closest('.range-slider__thumb-right');
    if (rightThumbFromEvent) {
      this.rightBoundary = this.sliderWidth;
      this.leftBoundary = this.leftThumb.getBoundingClientRect().right - this.sliderLeft;
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
      const { clientX } = event;
      let newLeft = clientX - this.leftBoundary + this.shiftX;

      if (newLeft < 0) {
        newLeft = 0;
      }

      if (newLeft > this.rightBoundary) {
        newLeft = this.rightBoundary;
      }
      let newLeftPercent = newLeft / this.sliderWidth * 100;
      this.dragging.style.left = `${newLeftPercent}%`;
      this.sliderProgress.style.left = `${newLeftPercent}%`;
      this.selected.from = Math.round(this.min + ((this.max - this.min) * newLeftPercent) / 100);
      this.spanFrom.innerHTML = this.formatValue(this.selected.from);
    } else {
      const { clientX } = event;
      let newLeft = clientX - this.sliderLeft + this.shiftX;

      // курсор вышел из слайдера => оставить бегунок в его границах.
      if (newLeft < this.leftBoundary) {
        newLeft = this.leftBoundary;
      }

      if (newLeft > this.sliderWidth) {
        newLeft = this.sliderWidth;
      }
      let newRightPercent = 100 - (newLeft / this.sliderWidth * 100);
      this.dragging.style.right = `${newRightPercent}%`;
      this.sliderProgress.style.right = `${newRightPercent}%`;
      this.selected.to = Math.round(this.min + ((this.max - this.min) * (100 - newRightPercent)) / 100);
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
    this.sliderWidth = this.sliderInner.getBoundingClientRect().width;
    this.sliderProgress = this.element.querySelector('.range-slider__progress');
    this.spanFrom = this.element.querySelector('[data-element="from"]');
    this.spanTo = this.element.querySelector('[data-element="to"]');
  }

  render() {
    const element = document.createElement('div');
    const left = (this.selected.from - this.min) / (this.max - this.min) * 100;
    const right = (this.max - this.selected.to) / (this.max - this.min) * 100;

    element.innerHTML = `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${left}%; right: ${right}%"></span>
          <span class="range-slider__thumb-left" style="left: ${left}%"></span>
          <span class="range-slider__thumb-right" style="right: ${right}%"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `;

    this.element = element.firstElementChild;
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
