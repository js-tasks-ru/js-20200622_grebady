export default class NotificationMessage {
  element; // HTMLElement;
  static previousElement;

  constructor(message, {
    duration = 0,
    type = ''
  } = {}) {
    if (NotificationMessage.previousElement) {
      NotificationMessage.previousElement.remove();
    }
    this.type = type;
    this.duration = duration;
    this.message = message;
    this.render();
  }


  get template() {
    const div = document.createElement('div');
    div.innerHTML = `
    <div class="notification ${this.type}" style="--value:${this.duration}ms">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>
    `;
    return div.firstElementChild;
  }

  render() {
    this.element = this.template;
    // this.element.textContent = this.element.textContent.trim();
  }
  show(parentElement = document.body) {
    parentElement.append(this.element);
    this.idTimer = setTimeout(() => this.remove(), this.duration);
    NotificationMessage.previousElement = this.element;
  }

  remove () {
    this.element.remove();
    NotificationMessage.previousElement = null;
  }

  destroy () {
    this.element.remove();
    NotificationMessage.previousElement = null;
  }
}
