const moment = require('moment');

moment.locale('ru');

export default class Widjet {
  constructor(initialElement) {
    this.initialElement = initialElement;
    this.parentEl = this.initialElement.querySelector('.ticket-container');
    // this.ticketContainer = this.ticketContainer;
    this.popup = undefined;
    this.listTickets = [];

    this.widjetTickets = this.widjetTickets.bind(this);
    this.deleteTicketWidjet = this.deleteTicketWidjet.bind(this);
    this.deletePopup = this.deletePopup.bind(this);
  }

  static patternTicket(id, executionLabel, title, text, classDescription, date) {
    return `
      <div id="${id}" class="ticket-item">
        <div class="ticket-switch circle" style = "color:${executionLabel}">&#10004</div>
        <div class="ticket-text">
          <p class="title">${title}</p>
          <p class="description" style="display:${classDescription}">${text}</p>
        </div>
        <div class="ticket-time">${date}</div>
        <div class="ticket-change circle">&#9998;</div>
        <div class="ticket-delete circle">&#10008;</div>
      </div>
    `;
  }

  static deletePopupTemplate() {
    return `
      <div class="popups">
        <div class="popup">
          <h3>Удалить тикет</h3>
          <p class="warning-text">Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
          <div class="buttons">
            <button class="resetBtn">Отмена</button>
            <button class="submitBth">Ок</button>
          </div>
        </div>
      </div>
    `;
  }

  static dataTicket(key, status, name, full, description, created) {
    const stat = Number(status);
    const statFull = Number(full);
    const date = moment(Number(created)).format('DD.MM.YYYY kk:mm');
    // const date = '19.03.2020'
    const id = key;
    const title = name;
    let text = '';
    let classDescription = 'none';
    let executionLabel = 'white';
    if (statFull === 1) classDescription = '';
    if (description) text = description.replace(/\r?\n/g, '<br>');
    if (stat === 1) executionLabel = 'black';
    return { id, executionLabel, title, text, classDescription, date };
  }

  widjetTickets() {
    if (this.listTickets.length) {
      this.listTickets.forEach((obj) => {
        const { id, executionLabel, title, text, classDescription, date } =
          Widjet.dataTicket(obj.id, obj.status, obj.name, obj.full, obj.description, obj.created);
        const html = Widjet.patternTicket(id, executionLabel, title, text, classDescription, date);
        this.parentEl.insertAdjacentHTML('beforeend', html);
      });
      return true;
    }
    return false;
  }

  deleteTicketWidjet() {
    const html = Widjet.deletePopupTemplate();
    this.initialElement.insertAdjacentHTML('beforeend', html);
    this.popup = this.initialElement.querySelector('.popups');
  }

  deletePopup() {
    this.popup.remove();
    this.popup = undefined;
  }
}
