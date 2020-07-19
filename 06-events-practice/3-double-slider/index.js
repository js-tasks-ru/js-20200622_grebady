export default class DoubleSlider {
  element; // HTMLElement;
  doubleSliderManaging = (event) => {
    const bodySlider = event.target.closest('.range-slider__progress');
    if (bodySlider) {
      const fullWidth = bodySlider.offsetHeight;
      let leftPosition =

    }
  }
  constructor() {
    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener('pointerdown', this.doubleSliderManaging);
  }

  render() {
    this.element = this.template;
  }

  get template() {
    const div = document.createElement('div');
    div.innerHTML = `
                    <div class="range-slider">
                      <span>$30</span>
                      <div class="range-slider__inner">
                        <span class="range-slider__progress" style="left: 0%; right: 0%"></span>
                        <span class="range-slider__thumb-left" style="left: 0%"></span>
                        <span class="range-slider__thumb-right" style="right: 0%"></span>
                      </div>
                      <span>$70</span>
                    </div>`;
    return div.firstElementChild;
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // additionally needed to remove all listeners...
  }
}
