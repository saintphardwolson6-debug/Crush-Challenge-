/* ===== MUSIC MUTE ===== */
const music = document.getElementById("music");
const muteBtn = document.getElementById("muteBtn");
if(music && muteBtn){
    muteBtn.addEventListener("click",()=>{
        music.muted = !music.muted;
        muteBtn.textContent = music.muted ? "🔈 Activer le son" : "🔊 Couper le son";
    });
}

/* ===== COPY LINK ===== */
function copyLink(){
    const input = document.getElementById("uidLink");
    input.select();
    document.execCommand("copy");
    alert("Lien copié ✅");
}

/* ===== GENERATE UID ===== */
function generateUID(name){
    const random = Math.floor(Math.random() * 10000);
    return name + "-" + random;
}

/* ===== INDEX.HTML - COMMENCER ===== */
const startForm = document.getElementById("startForm");
if(startForm){
    startForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        const playerName = document.getElementById("playerName").value;
        localStorage.setItem("hostName", playerName);

        // Share links dynamiques
        const url = window.location.origin + "/index.html";
        if(document.getElementById("shareWA")) document.getElementById("shareWA").href="https://wa.me/?text=Viens%20jouer%20au%20Crush%20Challenge%20👉%20"+encodeURIComponent(url);
        if(document.getElementById("shareFB")) document.getElementById("shareFB").href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url);
        if(document.getElementById("shareIG")) document.getElementById("shareIG").href="https://www.instagram.com/?url="+encodeURIComponent(url);
        if(document.getElementById("shareTT")) document.getElementById("shareTT").href="https://www.tiktok.com/share?url="+encodeURIComponent(url);

        window.location.href = "questions.html";
    });
}

/* ===== QUESTIONS.HTML - QUIZ LOGIC ===== */
const quizForm = document.getElementById("quizForm");
if(quizForm){
    let currentQ = 0;
    const questions = document.querySelectorAll(".question");
    let score = 0;

    function showQuestion(n){
        questions.forEach(q => q.style.display = "none");
        if(n < questions.length) questions[n].style.display = "block";
    }
    showQuestion(currentQ);

    questions.forEach(q=>{
        const btns = q.querySelectorAll(".optionBtn");
        btns.forEach(btn=>{
            btn.addEventListener("click",()=>{
                // Vérification: 1er bouton = bonne réponse
                if(btn.dataset.answer === btns[0].dataset.answer) score++;
                btn.classList.add(btn.dataset.answer === btns[0].dataset.answer ? "correct" : "wrong");
                setTimeout(()=>{
                    btn.classList.remove("correct","wrong");
                    currentQ++;
                    updateProgress(currentQ, questions.length);
                    showQuestion(currentQ);

                    if(currentQ >= questions.length){
                        const hostName = localStorage.getItem("hostName");
                        const uid = generateUID(hostName);
                        localStorage.setItem(uid, score); // score total
                        localStorage.setItem("lastUID", uid);
                        localStorage.setItem("lastScore", score);
                        window.location.href = "resultat.html";
                    }
                },500);
            });
        });
    });

    function updateProgress(current,total){
        const bar = document.getElementById("progressBar");
        if(bar) bar.style.width = ((current/total)*100) + "%";
    }
}