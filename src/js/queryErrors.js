export default class QueryErr {
  constructor(initialElement) {
    this.initialElement = initialElement;
    this.popup = undefined;

    this.errorWidjet = this.errorWidjet.bind(this);
    this.delErrorWidjet = this.delErrorWidjet.bind(this);
  }

  static errorWidgetTemplate() {
    return `
      <div class="popups">
        <div class="errorText">
          <p>Операция не может быть выполнена</p>
          <button class="btn-error">Закрыть</button>
        </div>
      </div>
    `;
  }

  errorWidjet() {
    const html = QueryErr.errorWidgetTemplate();
    this.initialElement.insertAdjacentHTML('beforeend', html);
    this.popup = this.initialElement.querySelector('.popups');
  }

  delErrorWidjet() {
    this.popup.remove();
    this.popup = undefined;
  }
}
