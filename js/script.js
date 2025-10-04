/* ================= MUSIC ================= */
const music = document.getElementById("music");
const muteBtn = document.getElementById("muteBtn");
if(music && muteBtn){
    muteBtn.addEventListener("click",()=>{
        music.muted = !music.muted;
        muteBtn.textContent = music.muted ? "🔈 Activer le son" : "🔊 Couper le son";
    });
}

/* ================= UID GENERATOR ================= */
function generateUID(name){
    return name + "-" + Math.floor(Math.random()*10000);
}

/* ================= INDEX.HTML ================= */
const startForm = document.getElementById("startForm");
if(startForm){
    startForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        const playerName = document.getElementById("playerName").value.trim();
        if(!playerName) return alert("Entrez votre nom !");
        localStorage.setItem("hostName", playerName);
        const uid = generateUID(playerName);
        localStorage.setItem("lastUID", uid);
        window.location.href = "questions.html";
    });
}

/* ================= QUESTIONS.HTML ================= */
const quizForm = document.getElementById("quizForm");
if(quizForm){
    const questions = document.querySelectorAll(".question");
    let currentQ = 0;
    let score = 0;

    function showQuestion(n){
        questions.forEach(q => q.style.display="none");
        if(n<questions.length) questions[n].style.display="block";
    }
    showQuestion(currentQ);

    questions.forEach(q=>{
        const options = q.querySelectorAll(".optionBtn");
        const nextBtn = q.querySelector(".nextBtn");
        options.forEach(opt=>{
            opt.addEventListener("click",()=>{
                if(opt.dataset.answer === options[0].dataset.answer) score++;
                options.forEach(b=>b.classList.remove("selected"));
                opt.classList.add("selected");
                nextBtn.disabled = false;
            });
        });

        nextBtn.addEventListener("click",()=>{
            currentQ++;
            updateProgress(currentQ, questions.length);
            if(currentQ>=questions.length){
                const uid = localStorage.getItem("lastUID");
                localStorage.setItem(uid + "-" + Date.now(), score);
                localStorage.setItem("lastScore", score);
                window.location.href = "resultat.html";
            } else showQuestion(currentQ);
        });
    });

    function updateProgress(current,total){
        const bar = document.getElementById("progressBar");
        if(bar) bar.style.width = ((current/total)*100) + "%";
    }
}

/* ================= RESULTAT.HTML ================= */
if(document.getElementById("hostName")){
    const hostName = localStorage.getItem("hostName");
    const score = localStorage.getItem("lastScore");
    const uid = localStorage.getItem("lastUID");

    document.getElementById("hostName").textContent = hostName;
    document.getElementById("scoreDisplay").textContent = score + "/10";
    const uidLink = document.getElementById("uidLink");
    uidLink.value = window.location.origin + "/jouer.html?uid=" + uid;

    const shareURL = encodeURIComponent(window.location.origin + "/jouer.html?uid=" + uid);
    if(document.getElementById("shareWA")) document.getElementById("shareWA").href="https://wa.me/?text=Viens%20jouer%20au%20Crush%20Challenge%20👉%20"+shareURL;
    if(document.getElementById("shareFB")) document.getElementById("shareFB").href="https://www.facebook.com/sharer/sharer.php?u="+shareURL;
    if(document.getElementById("shareIG")) document.getElementById("shareIG").href="https://www.instagram.com/?url="+shareURL;
    if(document.getElementById("shareTT")) document.getElementById("shareTT").href="https://www.tiktok.com/share?url="+shareURL;

    startConfetti();
}

/* ================= SCORE.HTML ================= */
if(document.getElementById("scoreTable")){
    const uid = localStorage.getItem("lastUID");
    const scoreTable = document.getElementById("scoreTable");
    if(uid && scoreTable){
        const scores = [];
        for(let i=0;i<localStorage.length;i++){
            const key = localStorage.key(i);
            if(key.includes(uid) && !key.includes("last")) {
                scores.push({name:key.split("-")[0], score:parseInt(localStorage.getItem(key))});
            }
        }
        scores.sort((a,b)=>b.score-a.score);
        scores.forEach(s=>{
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${s.name}</td><td>${s.score}/10</td>`;
            scoreTable.appendChild(tr);
        });

        const shareURL = encodeURIComponent(window.location.origin + "/jouer.html?uid="+uid);
        if(document.getElementById("shareWA")) document.getElementById("shareWA").href="https://wa.me/?text=Viens%20jouer%20au%20Crush%20Challenge%20👉%20"+shareURL;
        if(document.getElementById("shareFB")) document.getElementById("shareFB").href="https://www.facebook.com/sharer/sharer.php?u="+shareURL;
        if(document.getElementById("shareIG")) document.getElementById("shareIG").href="https://www.instagram.com/?url="+shareURL;
        if(document.getElementById("shareTT")) document.getElementById("shareTT").href="https://www.tiktok.com/share?url="+shareURL;
    }
}

/* ================= FONCTIONS UTILES ================= */
function rejouer(){ window.location.href = "index.html"; }

function creerDefi(){
    const hostName = prompt("Entrez votre nom pour créer votre défi :");
    if(hostName){
        localStorage.setItem("hostName", hostName);
        const uid = hostName + "-" + Math.floor(Math.random()*10000);
        localStorage.setItem("lastUID", uid);
        window.location.href = "questions.html";
    }
}

/* ================= CONFETTI ================= */
function startConfetti(){
    const canvas = document.getElementById("confetti");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const confetti = [];
    for(let i=0;i<150;i++){
        confetti.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height - canvas.height, r:Math.random()*6+4, d:Math.random()*150, color:"hsl("+Math.random()*360+",100%,50%)", tilt:Math.random()*10-10});
    }
    function draw(){ 
        ctx.clearRect(0,0,canvas.width,canvas.height); 
        confetti.forEach(c=>{
            ctx.beginPath();
            ctx.lineWidth=c.r;
            ctx.strokeStyle=c.color;
            ctx.moveTo(c.x+c.tilt+c.r/2,c.y);
            ctx.lineTo(c.x+c.tilt,c.y+c.tilt+c.r/2);
            ctx.stroke();
            update(c);
        });
    }
    function update(c){ 
        confetti.forEach(c=>{
            c.y+=Math.cos(c.d)+1+c.r/2;
            c.x+=Math.sin(c.d);
            if(c.y>canvas.height) c.y=-10;
        });
    }
    setInterval(draw,20);
}

/* ================= COPIER LINK ================= */
function copyLink(){
    const link = document.getElementById("uidLink");
    link.select();
    link.setSelectionRange(0,99999);
    document.execCommand("copy");
    alert("Lien copié !");
}