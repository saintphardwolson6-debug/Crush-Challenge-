// --- Variables globales ---
let currentQuestion = 0;
let score = 0;

// 10 questions exemple
const questions = [
  {question: "Quelle est ta couleur préférée ?", answers: ["Bleu","Rouge","Vert","Noir"], correct:"Bleu"},
  {question: "Quel est ton plat préféré ?", answers:["Pizza","Burger","Riz","Pâtes"], correct:"Pizza"},
  {question: "Quel est ton animal préféré ?", answers:["Chien","Chat","Poisson","Oiseau"], correct:"Chien"},
  {question: "Quel sport préfères-tu ?", answers:["Football","Basket","Tennis","Natation"], correct:"Football"},
  {question: "Quel est ton film préféré ?", answers:["Titanic","Avatar","Inception","Spider-Man"], correct:"Spider-Man"},
  {question: "Quel est ton style de musique ?", answers:["Pop","Rock","Rap","Jazz"], correct:"Pop"},
  {question: "Quel est ton fruit préféré ?", answers:["Pomme","Banane","Mangue","Orange"], correct:"Mangue"},
  {question: "Quel est ton super-héros préféré ?", answers:["Batman","Spider-Man","Iron Man","Superman"], correct:"Spider-Man"},
  {question: "Quelle saison préfères-tu ?", answers:["Printemps","Été","Automne","Hiver"], correct:"Été"},
  {question: "Quel est ton passe-temps favori ?", answers:["Lecture","Jeux vidéo","Sport","Musique"], correct:"Jeux vidéo"}
];

// --- Accueil: bouton Commencer ---
const startBtn = document.getElementById("startBtn");
if(startBtn){
  startBtn.addEventListener("click",()=>{
    const name = document.getElementById("playerName").value.trim();
    if(!name){ alert("Veuillez entrer votre nom !"); return; }
    localStorage.setItem("playerName", name);
    localStorage.setItem("playerScore",0);
    window.location.href = "questions.html";
  });
}

// --- Page questions ---
const questionTitle = document.getElementById("question-title");
const answersDiv = document.getElementById("answers");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");

if(questionTitle && answersDiv && nextBtn && progress){
  showQuestion();

  function showQuestion(){
    const q = questions[currentQuestion];
    questionTitle.textContent = q.question;
    answersDiv.innerHTML = "";
    q.answers.forEach(ans=>{
      const btn = document.createElement("button");
      btn.textContent = ans;
      btn.classList.add("optionBtn");
      btn.onclick = ()=>selectAnswer(ans,btn);
      answersDiv.appendChild(btn);
    });
    progress.textContent = `Question ${currentQuestion+1}/${questions.length}`;
    nextBtn.style.display = "none";
  }

  function selectAnswer(answer, btn){
    // Retire highlight nan tout bouton
    const allBtns = document.querySelectorAll(".optionBtn");
    allBtns.forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    nextBtn.style.display = "inline-block";
    nextBtn.onclick = ()=>{
      if(answer === questions[currentQuestion].correct) score++;
      localStorage.setItem("playerScore",score);
      currentQuestion++;
      if(currentQuestion < questions.length){
        showQuestion();
      }else{
        // Générer UID pour partage
        const playerName = localStorage.getItem("playerName") || "Joueur";
        const uid = playerName.toLowerCase()+"_"+Math.floor(Math.random()*1000000);
        localStorage.setItem("uid",uid);
        window.location.href = "resultat_score.html?uid="+uid;
      }
    };
  }
}

// --- Page résultat_score.html ---
const playerSpan = document.getElementById("player");
const scoreSpan = document.getElementById("score");
const uidInput = document.getElementById("uidLink");
const shareWA = document.getElementById("whatsapp");
const shareFB = document.getElementById("facebook");
const shareIG = document.getElementById("instagram");

if(playerSpan && scoreSpan){
  const name = localStorage.getItem("playerName") || "Joueur";
  const scoreStored = localStorage.getItem("playerScore") || 0;
  const uidStored = localStorage.getItem("uid") || (name.toLowerCase()+"_"+Math.floor(Math.random()*1000000));
  localStorage.setItem("uid",uidStored);

  playerSpan.textContent = name;
  scoreSpan.textContent = scoreStored;
  if(uidInput) uidInput.value = window.location.origin+"/questions.html?uid="+uidStored;

  const shareText = `Je viens de jouer à Le Jeu Pro! Score: ${scoreStored}/10. Viens essayer mon défi 👉 `;
  if(shareWA) shareWA.href = "https://wa.me/?text="+encodeURIComponent(shareText+window.location.origin+"/questions.html?uid="+uidStored);
  if(shareFB) shareFB.href = "https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(window.location.origin+"/questions.html?uid="+uidStored);
  if(shareIG) shareIG.href = "#";
}

// --- Fonction Rejouer ---
function rejouer(){ window.location.href="index.html"; }
// --- Fonction créer défi ---
function creerDefi(){ alert("Vous pouvez maintenant créer votre propre défi !"); }