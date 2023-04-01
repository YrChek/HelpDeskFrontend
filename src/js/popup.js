export default class Popup {
  constructor() {
    this.helpDesk = document.querySelector('.help-desk');
    this.popupWidjet = undefined;

    this.widjetAdd = this.widjetAdd.bind(this);
    this.pressBtnOk = this.pressBtnOk.bind(this);
    this.pressBtnСancel = this.pressBtnСancel.bind(this);
  }

  static patternWidjet(action) {
    return `
      <div class="popups">
        <div class="popup">
          <h3>${action}</h3>
          <form class="popupForm">
            <span>Краткое описание</span>
            <input name="name" type="text" class="heading">
            <span>Подробное описание</span>
            <textarea name="description" class="detailed"></textarea>
            <div class="buttons">
              <button type="reset" class="resetBtn">Отмена</button>
              <button type="submit" class="submitBth">Ок</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  widjetAdd() {
    const html = Popup.patternWidjet('Добавить тикет');
    this.helpDesk.insertAdjacentHTML('beforeend', html);
    this.popupWidjet = this.helpDesk.querySelector('.popups');
  }

  addWidgetChange(title, text) {
    const html = Popup.patternWidjet('Изменить тикет');
    this.helpDesk.insertAdjacentHTML('beforeend', html);
    this.popupWidjet = this.helpDesk.querySelector('.popups');
    const titleForm = this.popupWidjet.querySelector('.heading');
    const textForm = this.popupWidjet.querySelector('.detailed');
    titleForm.value = title;
    textForm.value = text.replace(/<br>/g, '\n');
  }

  pressBtnOk() {
    const time = Date.now();
    const formAdding = this.popupWidjet.querySelector('.popupForm');
    const body = new FormData(formAdding);
    body.append('status', Number(-1));
    body.append('created', time);
    body.append('full', Number(-1));
    return body;
  }

  pressBtnСancel() {
    this.popupWidjet.remove();
    this.popupWidjet = undefined;
  }
}
