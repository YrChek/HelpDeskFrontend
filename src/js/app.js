import Popup from './popup';
import Widjet from './widjet';
import QueryErr from './queryErrors';

document.addEventListener('DOMContentLoaded', () => {
  const initialElement = document.querySelector('.help-desk');
  const ticketContainer = initialElement.querySelector('.ticket-container');
  const createBtn = document.querySelector('.createBtn');
  let curentElement;

  const popup = new Popup();
  const widjet = new Widjet(initialElement);
  const queryErr = new QueryErr(initialElement);

  const url = 'http://localhost:7070/?method=';

  function errStart() {
    queryErr.errorWidjet();
    const p = queryErr.popup.querySelector('p');
    p.innerHTML = 'Ошибка связи с сервером';
    const btn = queryErr.popup.querySelector('.btn-error');
    btn.addEventListener('click', queryErr.delErrorWidjet);
  }

  function errResponse() {
    queryErr.errorWidjet();
    const btn = queryErr.popup.querySelector('.btn-error');
    btn.addEventListener('click', () => {
      queryErr.delErrorWidjet();
      resset();
    });
  }

  async function responseAllTickets() {
    const method = 'allTickets';
    const fullUrl = url + method;
    try {
      const response = await fetch(fullUrl);
      if (response.ok) {
        const data = await response.json();
        widjet.listTickets = data;
        widjet.widjetTickets();
      } else {
        console.log(`Ошибка HTTP: ${response.body}`);
        errResponse();
      }
    } catch (error) {
      console.log(`${method}: `, error);
      errStart();
    }
  }

  function resset() {
    const listChild = ticketContainer.querySelectorAll('.ticket-item');
    listChild.forEach((el) => el.remove());
    responseAllTickets();
  }

  async function responseNewTicket(e) {
    e.preventDefault();
    const method = 'createTicket';
    const fullUrl = url + method;
    const body = popup.pressBtnOk();
    popup.pressBtnСancel();
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        body,
      });
      if (response.ok) {
        resset();
      } else {
        console.log(`Ошибка HTTP: ${response.body}`);
        errResponse();
      }
    } catch (error) {
      console.log('Ошибка связи');
      errStart();
    }
  }

  function openPopup(e) {
    e.preventDefault();
    popup.widjetAdd();
    const clickBtnOk = popup.popupWidjet.querySelector('.submitBth');
    const clickBtnClean = popup.popupWidjet.querySelector('.resetBtn');
    clickBtnOk.addEventListener('click', responseNewTicket);
    clickBtnClean.addEventListener('click', popup.pressBtnСancel);
  }

  async function responseChangeTicket(e) {
    e.preventDefault();
    const id = curentElement.getAttribute('id');
    const method = 'changeTicket';
    const fullUrl = url + method;
    const body = popup.pressBtnOk();
    body.append('id', id);
    popup.pressBtnСancel();
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        body,
      });
      if (response.ok) {
        resset();
      } else {
        console.log(`Ошибка HTTP: ${response.body}`);
        errResponse();
      }
    } catch (error) {
      console.log('Ошибка связи');
      errStart();
    }
  }

  async function responseFullStatus(id) {
    const method = 'changeFull';
    const fullUrl = url + method;
    const body = JSON.stringify({ id });
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        resset();
      } else {
        console.log(`Ошибка HTTP: ${response.body}`);
        errResponse();
      }
    } catch (error) {
      console.log(`${method}: `, error);
      errStart();
    }
  }

  async function responseChangeTheStatusCompleted(id) {
    const method = 'statusСhange';
    const fullUrl = url + method;
    const body = JSON.stringify({ id });
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const ticketSwitch = curentElement.querySelector('.ticket-switch');
        const { color } = ticketSwitch.style;
        if (color === 'black') {
          ticketSwitch.style.color = 'white';
        } else {
          ticketSwitch.style.color = 'black';
        }
        // resset();
      } else {
        console.log(`Ошибка HTTP: ${response.body}`);
        errResponse();
      }
    } catch (error) {
      console.log('Ошибка связи');
      errStart();
    }
  }

  async function responseDeleteTicket() {
    const id = curentElement.getAttribute('id');
    const method = `ticketById&id=${id}`;
    const fullUrl = url + method;
    widjet.deletePopup();
    try {
      const response = await fetch(fullUrl, {
        method: 'DELETE',
      });
      if (response.ok) {
        resset();
      } else {
        console.log(`Ошибка HTTP: ${response.body}`);
        errResponse();
      }
    } catch (error) {
      console.log('Ошибка связи');
      errStart();
    }
  }

  function selectElements(e) {
    curentElement = e.target;
    // Изменение записи
    if (curentElement.classList.contains('ticket-change')) {
      curentElement = curentElement.closest('.ticket-item');
      const title = curentElement.querySelector('.title').innerHTML;
      const text = curentElement.querySelector('.description').innerHTML;
      popup.addWidgetChange(title, text);
      const clickBtnOk = popup.popupWidjet.querySelector('.submitBth');
      const clickBtnClean = popup.popupWidjet.querySelector('.resetBtn');
      clickBtnOk.addEventListener('click', responseChangeTicket);
      clickBtnClean.addEventListener('click', popup.pressBtnСancel);
      return;
    }
    // Изменение статуса для открытия описания
    if (curentElement.classList.contains('ticket-item')) {
      const id = curentElement.getAttribute('id');
      responseFullStatus(id);
      return;
    }
    // Изменение статуса выполнения
    if (curentElement.classList.contains('ticket-switch')) {
      curentElement = curentElement.closest('.ticket-item');
      const id = curentElement.getAttribute('id');
      responseChangeTheStatusCompleted(id);
      return;
    }
    // Удаление записи
    if (curentElement.classList.contains('ticket-delete')) {
      curentElement = curentElement.closest('.ticket-item');
      widjet.deleteTicketWidjet();
      const submitBth = widjet.popup.querySelector('.submitBth');
      const resetBtn = widjet.popup.querySelector('.resetBtn');
      submitBth.addEventListener('click', responseDeleteTicket);
      resetBtn.addEventListener('click', () => {
        widjet.deletePopup();
        resset();
      });
    }
  }

  responseAllTickets();

  createBtn.addEventListener('click', openPopup);
  ticketContainer.addEventListener('click', selectElements);
});
