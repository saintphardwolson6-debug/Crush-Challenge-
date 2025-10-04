// --- 1. CONFIGURATION DES QUESTIONS (10 questions personnelles) ---
const QUESTIONS = [
    {
        question: "Ton activité préférée pour te relaxer est...",
        options: ["Écouter de la musique", "Méditer/Respirer", "Regarder un bon film", "Faire une sieste"],
        reponseCorrecte: "Écouter de la musique" // Réponse arbitraire pour le scoring
    },
    {
        question: "Quel type de voyage préfères-tu ?",
        options: ["Aventure et Exploration", "Détente sur la plage", "Tourisme en ville", "Randonnée en montagne"],
        reponseCorrecte: "Aventure et Exploration"
    },
    {
        question: "Comment gères-tu un désaccord avec un ami ?",
        options: ["Je m'éloigne", "J'exprime mes sentiments immédiatement", "J'attends que ça passe", "Je cherche un compromis"],
        reponseCorrecte: "J'exprime mes sentiments immédiatement"
    },
    {
        question: "Ta boisson préférée (hors alcool) est...",
        options: ["Café", "Jus de fruits frais", "Eau gazeuse", "Boisson énergétique"],
        reponseCorrecte: "Jus de fruits frais"
    },
    {
        question: "À quel moment de la journée es-tu le plus productif ?",
        options: ["Tôt le matin", "Milieu de journée", "En soirée", "La nuit"],
        reponseCorrecte: "Tôt le matin"
    },
    {
        question: "Quel gadget technologique ne peux-tu pas te passer ?",
        options: ["Smartphone", "Ordinateur portable", "Écouteurs sans fil", "Console de jeu"],
        reponseCorrecte: "Smartphone"
    },
    {
        question: "Ta réaction face à l'échec est...",
        options: ["Je me décourage facilement", "J'analyse et j'apprends", "Je fais comme si de rien n'était", "Je demande de l'aide"],
        reponseCorrecte: "J'analyse et j'apprends"
    },
    {
        question: "Quel genre de film regardes-tu le plus souvent ?",
        options: ["Comédie", "Action/Thriller", "Documentaire", "Science-fiction/Fantastique"],
        reponseCorrecte: "Action/Thriller"
    },
    {
        question: "Tu préfères un environnement de travail...",
        options: ["Calme et structuré", "Animé et collaboratif", "Créatif et indépendant", "Flexible et à distance"],
        reponseCorrecte: "Animé et collaboratif"
    },
    {
        question: "Si tu devais donner un conseil à ton toi plus jeune, ce serait...",
        options: ["Prends plus de risques", "Épargne ton argent", "Étudie plus fort", "Écoute tes parents"],
        reponseCorrecte: "Prends plus de risques"
    }
];

// --- 2. GESTION DES VARIABLES ET DU DOM ---
let nomJoueur = localStorage.getItem('currentPlayerName') || "";
let score = parseInt(localStorage.getItem('currentScore')) || 0;
let indexQuestionActuelle = parseInt(localStorage.getItem('currentIndex')) || 0;
let reponseSelectionnee = null;

// Éléments DOM (communs à toutes les pages)
const sonClic = document.getElementById('son-clic');
const sonVictoire = document.getElementById('son-victoire');

// --- 3. FONCTIONS UTILITAIRES DE NAVIGATION ---

/**
 * Lance le son de clic.
 */
function playClickSound() {
    if (sonClic) {
        sonClic.currentTime = 0;
        sonClic.play().catch(e => console.log("Audio not played", e));
    }
}

/**
 * Sauvegarde l'état du quiz dans le LocalStorage.
 */
function sauvegarderEtat(name, index, currentScore) {
    localStorage.setItem('currentPlayerName', name);
    localStorage.setItem('currentIndex', index);
    localStorage.setItem('currentScore', currentScore);
}

// --- 4. LOGIQUE DE LA PAGE D'ACCUEIL (index.html) ---
const accueilContainer = document.getElementById('accueil-container');
const nomForm = document.getElementById('nom-form');
const nomInput = document.getElementById('nom-joueur');

if (accueilContainer && nomForm) {
    // Si l'utilisateur a déjà joué, on peut pré-remplir le nom
    if (localStorage.getItem('lastPlayer')) {
        nomInput.value = JSON.parse(localStorage.getItem('lastPlayer')).nom;
    }

    nomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        nomJoueur = nomInput.value.trim();
        if (nomJoueur) {
            // Initialisation du quiz
            sauvegarderEtat(nomJoueur, 0, 0);
            window.location.href = 'questions.html';
        }
    });
}

// --- 5. LOGIQUE DE LA PAGE DE QUESTIONS (questions.html) ---
const quizContainer = document.getElementById('quiz-container');
if (quizContainer) {
    // Récupération des éléments DOM spécifiques au quiz
    const progressionElement = document.getElementById('progression');
    const questionTextElement = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const btnSuivante = document.getElementById('btn-question-suivante');

    // Vérification de l'état du jeu
    if (!localStorage.getItem('currentPlayerName')) {
        window.location.href = 'index.html'; // Retour à l'accueil si pas de nom
        return;
    }

    /**
     * Gère la sélection de la réponse.
     */
    function selectionnerReponse(bouton, reponseChoisie) {
        if (reponseSelectionnee !== null) return;
        playClickSound();

        reponseSelectionnee = reponseChoisie;

        // Désactiver et marquer le bouton
        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('selected');
        });
        bouton.classList.add('selected');

        const question = QUESTIONS[indexQuestionActuelle];
        const estCorrect = (reponseChoisie === question.reponseCorrecte);

        if (estCorrect) {
            bouton.classList.add('correct');
            score++;
            localStorage.setItem('currentScore', score); // Mettre à jour le score dans le storage
        } else {
            bouton.classList.add('incorrect');
            // Afficher la bonne réponse
            Array.from(optionsContainer.children).forEach(btn => {
                if (btn.textContent === question.reponseCorrecte) {
                    btn.classList.add('correct');
                }
            });
        }

        btnSuivante.style.display = 'block';
    }

    /**
     * Affiche la question actuelle.
     */
    function afficherQuestion() {
        if (indexQuestionActuelle >= QUESTIONS.length) {
            terminerQuiz();
            return;
        }

        reponseSelectionnee = null;
        optionsContainer.innerHTML = '';
        btnSuivante.style.display = 'none';

        const question = QUESTIONS[indexQuestionActuelle];
        progressionElement.textContent = `${indexQuestionActuelle + 1}/${QUESTIONS.length}`;
        questionTextElement.textContent = question.question;

        question.options.forEach(option => {
            const bouton = document.createElement('button');
            bouton.textContent = option;
            bouton.classList.add('option-btn');
            bouton.addEventListener('click', () => selectionnerReponse(bouton, option));
            optionsContainer.appendChild(bouton);
        });
    }

    /**
     * Passe à la question suivante.
     */
    function passerQuestion() {
        indexQuestionActuelle++;
        sauvegarderEtat(nomJoueur, indexQuestionActuelle, score);
        afficherQuestion();
    }

    /**
     * Termine le quiz et enregistre le score.
     */
    function terminerQuiz() {
        if (sonVictoire) {
            sonVictoire.play().catch(e => console.log("Victory sound not played", e));
        }

        // 1. Sauvegarder le score final
        const resultatFinal = {
            nom: nomJoueur,
            score: score,
            date: new Date().toLocaleDateString('fr-FR')
        };
        localStorage.setItem('lastPlayer', JSON.stringify(resultatFinal));

        // 2. Mettre à jour le classement global
        sauvegarderScoreClassement(nomJoueur, score);

        // 3. Rediriger vers la page de résultats
        window.location.href = 'resultat.html';
    }

    // Initialisation
    afficherQuestion();
    btnSuivante.addEventListener('click', passerQuestion);
}


// --- 6. LOGIQUE PAGE RÉSULTAT ET CLASSEMENT (resultat.html) ---
const resultatContainer = document.getElementById('resultat-container');

if (resultatContainer) {
    const dernierJoueurJSON = localStorage.getItem('lastPlayer');

    if (!dernierJoueurJSON) {
        window.location.href = 'index.html';
        return;
    }

    const joueur = JSON.parse(dernierJoueurJSON);
    
    // 6.1 Affichage des résultats
    document.getElementById('message-felicitation').textContent = `Félicitations, ${joueur.nom} !`;
    document.getElementById('score-display').textContent = `${joueur.score}/${QUESTIONS.length}`;
    
    // 6.2 Affichage du classement
    afficherClassement();

    // 6.3 Gestion du Partage
    document.querySelectorAll('.btn-social').forEach(button => {
        button.addEventListener('click', () => {
            partagerScore(button.dataset.platform, joueur);
        });
    });

    document.getElementById('btn-partager-encore').addEventListener('click', () => {
        partagerScore('whatsapp', joueur);
    });

    // Option pour les Confettis (si vous utilisez une librairie)
    // if (window.confetti) { confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); }
}

/**
 * Sauvegarde le score dans le classement local.
 */
function sauvegarderScoreClassement(nom, score) {
    let classement = JSON.parse(localStorage.getItem('quizClassement')) || [];
    
    // Pour éviter les doublons, on met à jour si le score est meilleur
    const existingIndex = classement.findIndex(p => p.nom === nom);
    
    if (existingIndex > -1) {
        if (classement[existingIndex].score < score) {
            classement[existingIndex].score = score;
        }
    } else {
        classement.push({ nom, score });
    }

    classement.sort((a, b) => b.score - a.score);
    localStorage.setItem('quizClassement', JSON.stringify(classement));
}

/**
 * Affiche le classement dans resultat.html
 */
function afficherClassement() {
    const listeClassement = document.getElementById('liste-classement');
    if (!listeClassement) return;

    const classement = JSON.parse(localStorage.getItem('quizClassement')) || [];
    listeClassement.innerHTML = '';

    if (classement.length === 0) {
        listeClassement.innerHTML = '<li>Soyez le premier à jouer pour apparaître ici !</li>';
        return;
    }

    classement.slice(0, 10).forEach((joueur, index) => { // Afficher le top 10
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${index + 1}${index === 0 ? ' 👑' : '.'} ${joueur.nom}</span>
            <span>${joueur.score}/${QUESTIONS.length}</span>
        `;
        listeClassement.appendChild(li);
    });
}

/**
 * Gère le partage vers les plateformes sociales.
 */
function partagerScore(platform, joueur) {
    const nomEncode = encodeURIComponent(joueur.nom);
    const jeuURL = window.location.origin + window.location.pathname.replace('resultat.html', 'index.html');
    
    // Le lien est "pénalisé" par le nom du joueur, comme demandé
    const textePartage = `🎉 J'ai réussi le Quiz Crush Challenge avec ${joueur.score}/${QUESTIONS.length} ! Mon nom est dans le lien, essaie de me battre ! Clique ici: ${jeuURL}?challenger=${nomEncode}`;
    
    let shareUrl = '';

    if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textePartage)}`;
    } else if (platform === 'facebook') {
        // Facebook partage une URL, la description vient du textePartage
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jeuURL)}&quote=${encodeURIComponent(textePartage)}`;
    } else if (platform === 'tiktok' || platform === 'instagram') {
        // Ces plateformes n'ont pas d'API de partage direct simple
        alert(`Pour partager sur ${platform}, copiez le message ci-dessous et collez-le dans votre post ou story !\n\n${textePartage}`);
        return;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}
