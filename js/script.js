document.addEventListener("DOMContentLoaded", () => {
    let currentQuestion = 0;
    let score = 0;
    const questionDivs = Array.from(document.querySelectorAll(".question"));
    const startForm = document.getElementById("startForm");
    const music = document.getElementById("music");
    const muteBtn = document.getElementById("muteBtn");

    // Son mute
    if(muteBtn && music){
        muteBtn.addEventListener("click", ()=>{
            music.muted = !music.muted;
            muteBtn.textContent = music.muted?"🔈 Activer le son":"🔊 Couper le son";
        });
    }

    // Page accueil
    if(startForm){
        startForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            const input = document.getElementById("playerName");
            if(!input.value) return alert("Veuillez entrer votre nom !");
            const hostName = input.value.trim();
            localStorage.setItem("hostName", hostName);
            localStorage.setItem("hostScore",0);
            const uid = "ID"+Math.floor(Math.random()*1000000);
            localStorage.setItem("uid", uid);
            window.location.href="questions.html?uid="+uid;
        });
    }

    // Page questions
    if(questionDivs.length){
        showQuestion(currentQuestion);
        questionDivs.forEach((qDiv,index)=>{
            const options = Array.from(qDiv.querySelectorAll(".optionBtn"));
            const nextBtn = qDiv.querySelector(".nextBtn");
            options.forEach(opt=>{
                opt.addEventListener("click",()=>{
                    options.forEach(b=>b.classList.remove("selected"));
                    opt.classList.add("selected");
                    nextBtn.disabled=false;
                });
            });
            nextBtn.addEventListener("click",()=>{
                const selected = qDiv.querySelector(".optionBtn.selected");
                if(!selected) return;
                score++;
                localStorage.setItem("hostScore",score);
                currentQuestion++;
                if(currentQuestion<questionDivs.length){
                    showQuestion(currentQuestion);
                }else{
                    const uid = localStorage.getItem("uid") || ("ID"+Math.floor(Math.random()*1000000));
                    localStorage.setItem("uid",uid);
                    window.location.href="resultat_score.html?uid="+uid;
                }
            });
        });
        function showQuestion(index){
            questionDivs.forEach((q,i)=>q.style.display=i===index?"block":"none");
            const progressBar = document.getElementById("progressBar");
            if(progressBar) progressBar.style.width=((index+1)/questionDivs.length)*100+"%";
        }
    }

    // Page resultat_score.html
    const hostNameSpan=document.getElementById("hostName");
    const scoreDisplay=document.getElementById("scoreDisplay");
    const uidInput=document.getElementById("uidLink");
    if(hostNameSpan && scoreDisplay && uidInput){
        const hostNameStored=localStorage.getItem("hostName")||"Hôte";
        const hostScoreStored=localStorage.getItem("hostScore")||0;
        hostNameSpan.textContent=hostNameStored;
        scoreDisplay.textContent=hostScoreStored;
        let uidStored=localStorage.getItem("uid");
        if(!uidStored){
            uidStored="ID"+Math.floor(Math.random()*1000000);
            localStorage.setItem("uid",uidStored);
        }
        const link=window.location.origin+"/questions.html?uid="+uidStored;
        uidInput.value=link;
        document.getElementById("shareWA").href="https://wa.me/?text="+encodeURIComponent(link);
        document.getElementById("shareFB").href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(link);
        document.getElementById("shareIG").href="#";
        document.getElementById("shareTT").href="#";
    }
    launchConfetti(document.getElementById("confetti"));
});

// Copier le lien
function copyLink(){
    const uidInput=document.getElementById("uidLink");
    uidInput.select();
    uidInput.setSelectionRange(0,99999);
    document.execCommand("copy");
    alert("Lien copié !");
}

// Rejouer
function rejouer(){ window.location.href="index.html"; }

// Créer défi
function creerDefi(){ alert("Vous pouvez maintenant créer votre propre défi !"); }

// Confetti
function launchConfetti(canvas){
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    const particles=[];
    for(let i=0;i<150;i++){
        particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height-100,r:Math.random()*6+2,d:Math.random()*50+1,color:"hsl("+Math.random()*360+",100%,50%)",tilt:Math.random()*10-10});
    }
    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p=>{
            ctx.beginPath();
            ctx.lineWidth=p.r;
            ctx.strokeStyle=p.color;
            ctx.moveTo(p.x+p.tilt+p.r/2,p.y);
            ctx.lineTo(p.x+p.tilt,p.y+p.d);
            ctx.stroke();
        });
        update();
        requestAnimationFrame(draw);
    }
    function update(){
        particles.forEach(p=>{
            p.y+=2;
            if(p.y>canvas.height){ p.y=-10; p.x=Math.random()*canvas.width; }
        });
    }
    draw();
}