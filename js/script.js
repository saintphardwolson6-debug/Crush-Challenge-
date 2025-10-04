const startBtn = document.getElementById('startBtn');
const music = new Audio('assets/sounds/intro.mp3');

startBtn.addEventListener('click', () => {
  const name = document.getElementById('playerName').value.trim();
  if(name === '') {
    alert('Veuillez entrer votre nom pour commencer !');
    return;
  }
  localStorage.setItem('playerName', name);
  music.play();
  setTimeout(() => {
    window.location.href = 'questions.html';
  }, 1000);
});