class Tooltip {
  element;
  static instance;

  addTooltip = event => {
    const element = event.target.closest('[data-tooltip]');
    if (element) {
      this.render(element.dataset.tooltip);
      this.onMoveTooltip(event);
      document.addEventListener('pointermove', this.onMoveTooltip);
    }
  }
  onMoveTooltip = event => {
    const left = event.clientX + 10;
    const top = event.clientY + 10;
    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }
  onPointerOut = event => {
    this.remove();
  }

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }
  render(html) {
    this.element = document.createElement('div');
    this.element.className = "tooltip";
    this.element.innerHTML = html;
    document.body.append(this.element);
  }
  initialize() {
    document.addEventListener("pointerover", this.addTooltip);
    document.addEventListener("pointerout", this.onPointerOut);
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      document.removeEventListener('pointermove', this.onMoveTooltip);
    }
  }
  destroy() {
    document.removeEventListener('pointerover', this.addTooltip);
    document.removeEventListener('pointerout', this.onPointerOut);
    this.remove();
  }
}

const tooltip = new Tooltip();

export default tooltip;
