// Работающий tooltip

class Tooltip {
  element;
  static instance = null;
  addTooltip = event => {
    const element = event.target.closest('[data-tooltip]');
    if (element) {
      this.render(element.dataset.tooltip);
      this.onMoveTooltip(event);
      document.addEventListener('pointermove', this.onMoveTooltip);
    }
  }
  onMoveTooltip = event => {
    const left = event.clientX;
    const top = event.clientY;
    Tooltip.instance.style.left = `${left}px`;
    Tooltip.instance.style.top = `${top}px`;
  }
  onPoinerOut = event => {
    this.remove();
    document.removeEventListener('pointermove', this.onMoveTooltip);
  }


  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
  }

  render(html) {
    const div = document.createElement('div');
    div.innerHTML = `<div class="tooltip">${html}</div>`;
    this.element = div.firstElementChild;
    Tooltip.instance = div.firstElementChild;
    document.body.append(Tooltip.instance);
  }

  initialize() {
    document.addEventListener("pointerover", this.addTooltip);
    document.addEventListener("pointerout", this.onPoinerOut);
  }
  remove () {
    if (Tooltip.instance) {
      Tooltip.instance.remove();
      Tooltip.instance = null;
      this.element = null;
    }
  }
  destroy() {
    document.removeEventListener('pointerover', this.addTooltip);
    document.removeEventListener('pointerout', this.onPoinerOut);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
