/*******************************************/
/*MES VARIABLES*/

/*mes son*/
let audio = {
  depart: new Audio("sons/playAgame.mp3"),
  succes: new Audio("sons/succes.mp3"),
  echec: new Audio("sons/echec.mp3"),
  rire: new Audio("sons/chuckyLaugh.mp3"),
  recommence: new Audio("sons/sonRecommencer.mp3"),
  musiqueFond: new Audio("sons/sawSong.mp3"),
};

// cette variable répresentera le nombre de bonnes réponses
let score = 0;
//la taille pour la scie finale est à 0 au départ
let scale = 1;

//l'opacité de la scie finale est à 1 au départ
let opacite = 1;
//la variable qui va gérer le meilleur résultat
let TonMeilleurResultat = localStorage.getItem("MeilleurResultat") || 0;

let laQuestion = 0; //on commence par la première question

/********************RÉCUPERATION DES BALISES*******************/
//je vais aller récupérer le bouton dans l'intro. Sa classe est .boutonCommencerQuiz
let boutonCommencerQuiz = document.querySelector(".boutonCommencerQuiz");
//je viens y donner un event listener de click
boutonCommencerQuiz.addEventListener("click", enleverIntro);
//je vais récupérer la balise div qui a le bouton recommencer quiz
let boutonRecommencerQuiz = document.querySelector(".boutonRecommencerQuiz");
//je vais aller chercher le h4 de la fin pour afficher le score
let h4Fin = document.querySelector(".fin h4");
//je vais aller chercher le h5
let h5Fin = document.querySelector(".fin h5");

/* Création des balises nécessaires dont les classes sont déjà dans le quiz***********/
let mainIntro = document.querySelector(".accueil"); //la page intro
//la page intro existe déjà dans le htlm, don pas besoin d'en créer
let mainQuiz = document.querySelector(".quiz"); //la page du quiz
//je vais aller chercher le main qui affichera la fin du quiz
let finQuiz = document.querySelector(".fin");

//les 3 balises qui affichent le main du quiz
let lesQuestionsQuiz = document.querySelector(".lesQuestionsQuiz"); //je récupère la div avec les questions
let leChoixDeReponses = document.querySelector(".leChoixDeReponsesQuiz"); //je récupère la div contenant les réponses
let compteurBonnesReponses = document.querySelector(".compteurBonnesReponses"); //je récupère la div ayant le compteur

//window.cancelAnimationFrame(AgrandirScie);

/***************Étape 1B: Création de la fonction pour enlever l'intro**********/
function enleverIntro() {
  //je fais jouer les sons de début
  audio.depart.play();
  audio.musiqueFond.play();

  //je veux faire un espèce de transition entre écrans.
  mainIntro.style.animation = "opaciteEnleve 5s";
  //je dis à l'intro que son display devient none et il ne s'affichera pas
  mainIntro.style.display = "none";
  //j'appelle la fonction qui va faire apparaître le main.quiz
  afficherLeMainQuiz();
}

/*ÉTAPE 3: affichage du main.quiz et de placer toutes les balises du quiz en dedans*/
function afficherLeMainQuiz() {
  //je veux faire un espèce de transition entre écrans.
  mainQuiz.style.animation = "opaciteMontre 5s";
  //le main du quiz s'affiche
  mainQuiz.style.display = "flex";
  //la fonction afficherQuestion s'active
  afficherQuestion();
}

function afficherQuestion() {
  mainQuiz.style.animation = "opaciteMontre 5s";

  //on doit récupérer la question en cours. la variable laQuestion = 0, donc début du tableau.
  let uneQuestion = lesQuestions[laQuestion];

  //ensuite je vais afficher la question, dans un h4, car dans mon css le h4 est défini pour les questions
  lesQuestionsQuiz.innerHTML = "<h4>" + uneQuestion.titre + "</h4>";

  //Avant tout, la deuxième question a un bouton rire...
  //si la question en cours c'est la deuxième question dans le tableau de questions
  if (uneQuestion == lesQuestions[1]) {
    // je vais créer une div vide
    boutonRire = document.createElement("div");
    //cette div aura la class boutonRire
    boutonRire.classList.add("boutonRire");
    //je vais append (placer) dans la div qui aura les questions
    lesQuestionsQuiz.append(boutonRire);
    // je vais rajouter un h6 dans le bouton avec les instructions
    instructions = document.createElement("h6");
    //je vais afficher les instructions
    instructions.innerHTML = " Activer <br> Le rire";
    //je vais append (placer) ces instructions dans le bouton
    boutonRire.append(instructions);
    //je vais donner un event listener au bouton pour que l'utilisateur puisse activer le rire à sa guisse
    boutonRire.addEventListener("click", activerRire);
  }

  // on vide le tableau de réponses, pour la prochaine question
  leChoixDeReponses.innerHTML = "";

  //je vais créer une variable tableauDeChoix qui est égale à une question.choix.
  let tableauDeChoix = uneQuestion.choix;
  //la boucle est crée pour aller chercher le i du tableau
  for (let i = 0; i < tableauDeChoix.length; i++) {
    //je vais créer la div dans laquelle on va retrouver les images
    let divChoix = document.createElement("div");
    //il y a 4 classes. 1 pour chaque image car elles ont chacun une propriété background Image qui affichera les images au choix.
    divChoix.classList.add("image" + (i + 1));
    //je donne à cette div l'image de background selon leur i
    divChoix.style.backgroundImage = "url(images/" + tableauDeChoix[i] + ")";
    //je mets cette div dans le conteneur des 4 images de choix
    leChoixDeReponses.append(divChoix);
    // je vais mettre un event listener au divChoix pour vérifier si c'est la bonne réponse
    divChoix.addEventListener("click", verifierReponses);
    //je vais enregister l'index à chaque image pour que toute puisse fonctionner
    divChoix.numero = i;

    // animations de question à question
    leChoixDeReponses.style.animation = `animationSection${laQuestion} 1s ease-in forwards`;
    lesQuestionsQuiz.style.animation = `animationSection${laQuestion} 1s ease-in forwards`;
  }
}

// function bien tranquille pour activer le rire pour la question 2
function activerRire() {
  //je fais jouer le rire
  audio.rire.play();
}

//création de la fonction pour vérifier la réponse
//pourquoi on met event dans la parenthèse? je ne sais pas trop
function verifierReponses(event) {
  //création d'une variable qui va venir chercher l'index du divChoix avec le target
  let index = event.target.numero;
  //console.log(index); //ici mon index marche bien

  //je vais créer une variable qui va aller chercher la bonne réponse de chaque objet
  let reponse = lesQuestions[laQuestion].bonneReponse;
  //console.log(reponse); // Ça marche!

  // si l'index étant le choix de la personne est égale à la bonne réponse
  if (index == reponse) {
    //l'audio joue
    audio.succes.play();
    //l'animation bonne réponse est déclanché
    event.target.style.animation = "AnimationBonneReponse 3s";

    //si c'est la bonne réponse on augmente le score
    score++;
    //je viens rajouter un h4 et saluant l'utilisateur et une explication apparaît
    compteurBonnesReponses.innerHTML =
      "<h5> Bonne réponse! </h5> " +
      "<h5>" +
      lesQuestions[laQuestion].explication +
      "</h5>";

    //si l'utilisateur click sur la mauvaise réponse
  } else {
    //l'audio mauvais réponse joue
    audio.echec.play();
    //l'animation mauvaise réponse joue
    event.target.style.animation = "AnimationMauvaiseReponse 3s";
    //on dit à l'utilisateur qu'il n'a pas eu la bonne réponse
    compteurBonnesReponses.innerHTML = "<h5> Mauvaise réponse! </h5>";
  }

  //je passe à la prochaine question seulement si leurs aniations finissent
  event.target.addEventListener("animationend", gererQuestionSuivante);
}

//fonction pour gérer la prochaine question
function gererQuestionSuivante() {
  //la div contenant les questions devient complètement visible. car elle est à 0 au départ
  leChoixDeReponses.style.opacity = 1;
  //je nettoie la div qui contient l'explicatif
  compteurBonnesReponses.innerHTML = "";
  //je passe à la prochaine question du tableau
  laQuestion++;

  //S'il reste une question on l'affiche, sinon c'est la fin du jeu...
  if (laQuestion < lesQuestions.length) {
    //On affiche la prochaine question
    afficherQuestion();
  } else {
    //C'est la fin du quiz
    afficherFinQuiz();
  }
}

function afficherFinQuiz() {
  //je dis au main quiz d'activer l'animation pour devenir transperent
  mainQuiz.style.animation = "opaciteEnleve 5s";
  //ensuite je lui dis de s'enlever
  mainQuiz.style.display = "none";
  //je dis au main fin d<activer son animation pour passer de transperent à complet
  finQuiz.style.animation = "opaciteMontre 5s";
  //je luis dit de s'afficher en flex
  finQuiz.style.display = "flex";
  //je remplis le h4 avec le score du moment
  h4Fin.innerHTML = "Votre score est de: " + score;
  // le h5 contiendra la variable entreposée dans le local storage
  h5Fin.innerHTML = "Ton meilleur résultat est de " + TonMeilleurResultat;
  //si je ne fais pas math max, à la première partie ça va montrer undefined.
  TonMeilleurResultat = Math.max(TonMeilleurResultat, score);
  //local storage
  localStorage.setItem("MeilleurResultat", TonMeilleurResultat);
}

//je vais lui donner un event listener click au bouton recommencer quiz
boutonRecommencerQuiz.addEventListener("click", recommencerQuiz);

//fonction pour recommencer le quiz
function recommencerQuiz() {
  //j'utilise RAFael pour faire jouer l'animation de taille de la scie
  requestAnimationFrame(AgrandirScie);
  //je fais jouer le son final
  audio.recommence.play();
  //j'arrête la musique de fond
  audio.musiqueFond.pause();
}

//je vais aller chercher l'image de la scie finale
let scieFinale = document.querySelector(".scieFin");

//scieFinale.style.scale = "100%";

//let scale = scieFinale;
//je mais un compteur qui ne tient pas en compte le temps écoulé depuis le début de la partie
let tempsDebut = null;

//la fonction pour agrandir la scie
function AgrandirScie(tempsActuel) {
  //si le temps en compte n'est pas encore pris en considération
  if (tempsDebut == null) {
    //on l'associe au temps actuel qui est activé lorsqu'on déclanche la fonction agrandir scie
    tempsDebut = tempsActuel;
  }

  //je fais agrandir la scie tranquillement
  scale += 0.1;
  //l'opacité également, sinon vers la fin de l'animation est trop pixelisé et ceci le cache
  opacite -= 0.003;
  //j'associe  le style scale avec la variable scale
  scieFinale.style.scale = scale;
  //j'associe le style opacity avec la variable opacite
  scieFinale.style.opacity = opacite;

  // si le temps écoulé est inférieur à 6 secondes
  if (tempsActuel <= 6000 + tempsDebut) {
    // RAFael se manifèste sans arrêt
    requestAnimationFrame(AgrandirScie);
    //sinon c'est la fin
  } else {
    //je dis au  main fin d'activer son animation pour passer de complet à transparent
    finQuiz.style.animation = "opaciteEnleve 2s";
    //je luis dit de s'enlever
    finQuiz.style.display = "none";
    // je reinitialise la question
    laQuestion = 0;
    //je dis au main intro d'activer l'animation pour apparaître
    mainIntro.style.animation = "opaciteMontre 2s";
    //ensuite je lui dis de s'afficher en flex
    mainIntro.style.display = "flex";

    //je viens reinitialser le score. Si je ne le fais pas
    // l'utilisateur peut continuer à rejouer et le local
    //storage va continuer de s'additionner
    score = 0;
    tempsDebut = null;
    opacite = 1;
    scale = 1;
    scieFinale.style.scale = scale;
    scieFinale.style.opacity = opacite;
  }
}
