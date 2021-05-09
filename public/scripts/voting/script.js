const voteInputs = document.querySelectorAll('.vote-input');

const enteredVotes = new Set();

document.addEventListener('focusout', (e) => {
  if(e.target && e.target.className === 'vote-input') {
    if(enteredVotes.has(e.target.value)) {
      e.target.closest('td').querySelector('.warning-message').classList.add('active');
    } else {
      e.target.closest('td').querySelector('.warning-message').classList.remove('active');
      enteredVotes.add(e.target.value);
    }
  }
});

document.addEventListener('mousedown', (e) => {
  if(e.target && e.target.className === 'vote-input') {
    enteredVotes.delete(e.target.value);
  }
});