const questions = [
  {
    question: "Quelle est ta couleur préférée ?",
    answers: ["Bleu", "Rouge", "Noir", "Vert"],
    correct: "Bleu"
  },
  {
    question: "Quel est ton plat préféré ?",
    answers: ["Pizza", "Burger", "Riz", "Pâtes"],
    correct: "Pizza"
  },
  {
    question: "Quel est ton animal préféré ?",
    answers: ["Chien", "Chat", "Oiseau", "Poisson"],
    correct: "Chien"
  },
  {
    question: "Quel sport préfères-tu ?",
    answers: ["Football", "Basketball", "Tennis", "Natation"],
    correct: "Football"
  },
  {
    question: "Quel est ton film préféré ?",
    answers: ["Avatar", "Titanic", "Fast & Furious", "Spider-Man"],
    correct: "Spider-Man"
  }
];

let currentQuestion = 0;
let score = 0;

const questionTitle = document.getElementById("question-title");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");

function showQuestion() {
  const q = questions[currentQuestion];
  questionTitle.textContent = q.question;
  answersDiv.innerHTML = "";
  q.answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.textContent = ans;
    btn.onclick = () => selectAnswer(ans);
    answersDiv.appendChild(btn);
  });
  progress.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
  nextBtn.style.display = "none";
}

function selectAnswer(answer) {
  const correct = questions[currentQuestion].correct;
  if (answer === correct) score++;
  nextBtn.style.display = "inline-block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    localStorage.setItem("playerScore", score);
    window.location.href = "resultat_score.html";
  }
});

showQuestion();