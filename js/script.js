// js/questions.js
// Définit et expose listes de questions et utilitaires
window.questionsForPreview = async function() {
  return QUESTIONS;
};

// Jeu: 10 questions (français). Répondez avèk index.
const QUESTIONS = [
  { q: "Quelle est ta couleur préférée ?", choices: ["Rouge", "Bleu", "Vert", "Noir"], answer: 1 },
  { q: "Quel est ton plat préféré ?", choices: ["Pizza", "Sushi", "Burger", "Salade"], answer: 0 },
  { q: "Quel est ton loisir préféré ?", choices: ["Sport", "Musique", "Cuisine", "Jeux vidéos"], answer: 1 },
  { q: "Tu préfères ... ?", choices: ["Plage", "Montagne", "Ville", "Campagne"], answer: 0 },
  { q: "Quel animal préfères-tu ?", choices: ["Chat", "Chien", "Oiseau", "Poisson"], answer: 1 },
  { q: "Quand tu sors, tu aimes ... ?", choices: ["Danser", "Regarder un film", "Lire", "Faire une rando"], answer: 0 },
  { q: "Ton style musical ?", choices: ["Pop", "Hip-hop", "Électro", "R&B"], answer: 0 },
  { q: "Boisson favorite ?", choices: ["Eau", "Jus", "Café", "Soda"], answer: 2 },
  { q: "Série préférée ?", choices: ["Friends", "Stranger Things", "Peaky Blinders", "The Witcher"], answer: 0 },
  { q: "Jeu vidéo préféré ?", choices: ["FIFA", "Fortnite", "Minecraft", "Valorant"], answer: 2 }
];

// Exporte la liste pour autres fichiers
if (typeof window !== 'undefined') {
  window.__CRUSH_QUESTIONS = QUESTIONS;
}