const forms = document.querySelectorAll('form');
const changeButtons = document.querySelectorAll('.change-wrapper a');

changeButtons.forEach(button => {
  button.addEventListener('click', () => {
    for(const elem of forms) {
      elem.classList.toggle('active-form');
    }
  });
});