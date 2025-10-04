// ==================== VARIABLES GLOBALES ====================
let currentQuestion = 0;
let score = 0;
let hostName = "";
let uid = "";
let participants = JSON.parse(localStorage.getItem("participants") || "[]");

// ==================== START FORM INDEX.HTML ====================
document.addEventListener("DOMContentLoaded", () => {
    const startForm = document.getElementById("startForm");
    const music = document.getElementById("music");
    const muteBtn = document.getElementById("muteBtn");

    if (muteBtn && music) {
        muteBtn.addEventListener("click", () => {
            music.muted = !music.muted;
            muteBtn.textContent = music.muted ? "🔈 Activer le son" : "🔊 Couper le son";
        });
    }

    if (startForm) {
        startForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = document.getElementById("playerName");
            if (!input.value) return alert("Veuillez entrer votre nom !");
            hostName = input.value.trim();
            localStorage.setItem("hostName", hostName);
            localStorage.setItem("hostScore", 0);
            // Generer UID
            uid = "ID" + Math.floor(Math.random() * 1000000);
            localStorage.setItem("uid", uid);
            window.location.href = "questions.html?uid=" + uid;
        });
    }

    // ==================== QUESTIONS.HTML ====================
    const questionsForm = document.getElementById("quizForm");
    if (questionsForm) {
        const questionDivs = Array.from(document.querySelectorAll(".question"));
        showQuestion(currentQuestion);

        questionDivs.forEach(qDiv => {
            const options = Array.from(qDiv.querySelectorAll(".optionBtn"));
            const nextBtn = qDiv.querySelector(".nextBtn");

            options.forEach(opt => {
                opt.addEventListener("click", () => {
                    // Marquer bouton choisi
                    options.forEach(b => b.classList.remove("selected"));
                    opt.classList.add("selected");
                    nextBtn.disabled = false;
                });
            });

            nextBtn.addEventListener("click", () => {
                const selected = qDiv.querySelector(".optionBtn.selected");
                if (selected) {
                    // Sove score selon mo kle (exemple: toujou 1 pt)
                    score++;
                    currentQuestion++;
                    localStorage.setItem("hostScore", score);
                    if (currentQuestion < questionDivs.length) {
                        showQuestion(currentQuestion);
                    } else {
                        // Fin des questions -> Resultat
                        window.location.href = "resultat_score.html?uid=" + uid;
                    }
                }
            });
        });

        function showQuestion(index) {
            questionDivs.forEach((q, i) => q.style.display = i === index ? "block" : "none");
            // Update progress bar
            const progressBar = document.getElementById("progressBar");
            if (progressBar) {
                progressBar.style.width = ((index + 1) / questionDivs.length) * 100 + "%";
            }
        }
    }

    // ==================== RESULTAT_SCORE.HTML ====================
    const hostNameSpan = document.getElementById("hostName");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const uidInput = document.getElementById("uidLink");

    if (hostNameSpan && scoreDisplay && uidInput) {
        const hostNameStored = localStorage.getItem("hostName") || "Hôte";
        const hostScoreStored = localStorage.getItem("hostScore") || 0;
        hostNameSpan.textContent = hostNameStored;
        scoreDisplay.textContent = hostScoreStored;

        // UID et lien
        let uidStored = localStorage.getItem("uid");
        if (!uidStored) {
            uidStored = "ID" + Math.floor(Math.random() * 1000000);
            localStorage.setItem("uid", uidStored);
        }
        const link = window.location.origin + "/questions.html?uid=" + uidStored;
        uidInput.value = link;

        // Share links
        const shareWA = document.getElementById("shareWA");
        const shareFB = document.getElementById("shareFB");
        const shareIG = document.getElementById("shareIG");
        const shareTT = document.getElementById("shareTT");
        if (shareWA) shareWA.href = "https://wa.me/?text=" + encodeURIComponent(link);
        if (shareFB) shareFB.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(link);
        if (shareIG) shareIG.href = "#"; // IG pas de partage direct
        if (shareTT) shareTT.href = "#"; // TikTok pas de partage direct
    }

    // ==================== CONFETTI ====================
    const canvas = document.getElementById("confetti");
    if (canvas) launchConfetti(canvas);

});

// ==================== COPIER LINK ====================
function copyLink() {
    const uidInput = document.getElementById("uidLink");
    uidInput.select();
    uidInput.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Lien copié !");
}

// ==================== REJOUER ====================
function rejouer() {
    window.location.href = "index.html";
}

// ==================== CREER DEFI ====================
function creerDefi() {
    alert("Vous pouvez maintenant créer votre propre défi !");
}

// ==================== CONFETTI SIMPLE ====================
function launchConfetti(canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - 100,
            r: Math.random() * 6 + 2,
            d: Math.random() * 50 + 1,
            color: "hsl(" + Math.random() * 360 + ",100%,50%)",
            tilt: Math.random() * 10 - 10
        });
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.d);
            ctx.stroke();
        });
        update();
        requestAnimationFrame(draw);
    }
    function update() {
        particles.forEach(p => {
            p.y += 2;
            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });
    }
    draw();
}