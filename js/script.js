document.addEventListener("DOMContentLoaded", () => {
    let currentQuestion = 0;
    let score = 0;
    const questionDivs = Array.from(document.querySelectorAll(".question"));

    function showQuestion(index){
        questionDivs.forEach((q,i) => q.style.display = i===index ? "block":"none");
        // Update progress bar
        const progressBar = document.getElementById("progressBar");
        if(progressBar){
            progressBar.style.width = ((index+1)/questionDivs.length)*100 + "%";
        }
    }

    showQuestion(currentQuestion);

    questionDivs.forEach((qDiv, index) => {
        const options = Array.from(qDiv.querySelectorAll(".optionBtn"));
        const nextBtn = qDiv.querySelector(".nextBtn");

        options.forEach(opt => {
            opt.addEventListener("click", () => {
                options.forEach(b=>b.classList.remove("selected"));
                opt.classList.add("selected");
                nextBtn.disabled = false; // bouton active
            });
        });

        nextBtn.addEventListener("click", () => {
            const selected = qDiv.querySelector(".optionBtn.selected");
            if(!selected) return; // pas de clic si aucun
            score++; // ou logique selon mot clé
            currentQuestion++;
            localStorage.setItem("hostScore", score);

            if(currentQuestion < questionDivs.length){
                showQuestion(currentQuestion);
            } else {
                // Fin du quiz -> resultat
                const uid = localStorage.getItem("uid") || ("ID"+Math.floor(Math.random()*1000000));
                localStorage.setItem("uid", uid);
                window.location.href = "resultat_score.html?uid="+uid;
            }
        });
    });
});