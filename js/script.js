// Music mute
const music=document.getElementById("music");
const muteBtn=document.getElementById("muteBtn");
if(music && muteBtn){
    muteBtn.addEventListener("click",()=>{
        music.muted = !music.muted;
        muteBtn.textContent = music.muted ? "🔈 Activer le son" : "🔊 Couper le son";
    });
}

// Copier lien
function copyLink(){
    const input = document.getElementById("hostLink") || document.getElementById("uidLink");
    input.select();
    document.execCommand("copy");
    alert("Lien copié ✅");
}

// Générer UID
function generateUID(hostName){
    const random = Math.floor(Math.random()*10000);
    return hostName+"-"+random;
}

// hostForm
const hostForm = document.getElementById("hostForm");
if(hostForm){
    hostForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        const data = new FormData(hostForm);
        const hostName = data.get("hostName");
        const uid = generateUID(hostName);
        const hostData = {};
        for(let [key,value] of data.entries()){hostData[key]=value;}
        localStorage.setItem(uid, JSON.stringify(hostData));
        const link = `${window.location.origin}/jouer.html?uid=${uid}`;
        document.getElementById("hostLink").value = link;
        document.getElementById("generatedLink").style.display="block";
    });
}

// playForm
const playForm = document.getElementById("playForm");
if(playForm){
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("uid");
    playForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        const data = new FormData(playForm);
        const playerName = data.get("playerName");
        const hostData = JSON.parse(localStorage.getItem(uid));
        let score = 0;
        for(let [key,value] of data.entries()){
            if(hostData && hostData[key] && hostData[key].toLowerCase()===value.toLowerCase()){score++;}
        }
        localStorage.setItem(playerName+"-"+uid, score);
        localStorage.setItem("lastPlayer", playerName+"-"+uid);
        window.location.href = "resultat.html?uid="+uid;
    });
}

// resultat.html
window.addEventListener("load", ()=>{
    const scoreEl = document.getElementById("scoreFinal");
    const uidLinkEl = document.getElementById("uidLink");
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get("uid") || "ABC123";

    if(uidLinkEl){uidLinkEl.value = `${window.location.origin}/jouer.html?uid=${uid}`;}
    if(scoreEl){
        const lastPlayer = localStorage.getItem("lastPlayer");
        const score = localStorage.getItem(lastPlayer) || 0;
        scoreEl.textContent = score;
    }

    // Share
    const url = uidLinkEl ? uidLinkEl.value : window.location.href;
    if(document.getElementById("shareWA")) document.getElementById("shareWA").href = "https://wa.me/?text=Viens%20jouer%20au%20Crush%20Challenge%20👉%20"+encodeURIComponent(url);
    if(document.getElementById("shareFB")) document.getElementById("shareFB").href = "https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(url);
    if(document.getElementById("shareTW")) document.getElementById("shareTW").href = "https://twitter.com/intent/tweet?url="+encodeURIComponent(url)+"&text=Viens%20jouer%20au%20Crush%20Challenge !");
    
    // Tableau score
    if(document.getElementById("scoreTable")){
        const table = document.getElementById("scoreTable");
        for(let key in localStorage){
            if(key.includes(uid)){
                const tr = document.createElement("tr");
                const tdName = document.createElement("td");
                const tdScore = document.createElement("td");
                tdName.textContent = key.replace("-"+uid,"");
                tdScore.textContent = localStorage.getItem(key);
                tr.appendChild(tdName);
                tr.appendChild(tdScore);
                table.appendChild(tr);
            }
        }
    }
});