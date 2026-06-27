document.addEventListener('DOMContentLoaded', () => {
  const refs = {
    openModalBtns: document.querySelectorAll('[data-modal-open]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
  };

  if (!refs.modal) return;

  function toggleModal() {
    refs.modal.classList.toggle('is-open');
    // Блокуємо скрол сторінки, коли модалка відкрита
    document.body.classList.toggle('menu-open'); 
  }

  // Вішаємо слухачі на всі кнопки відкриття
  refs.openModalBtns.forEach(btn => {
    btn.addEventListener('click', toggleModal);
  });

  // Закриття по хрестику
  refs.closeModalBtn.addEventListener('click', toggleModal);

  // Закриття по кліку на темний фон (бекдроп)
  refs.modal.addEventListener('click', (e) => {
    if (e.target === refs.modal) {
      toggleModal();
    }
  });

  // Закриття по клавіші Escape (крутий плюс до UX)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && refs.modal.classList.contains('is-open')) {
      toggleModal();
    }
  });
});