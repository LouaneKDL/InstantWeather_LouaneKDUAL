const validation = document.getElementById("ville");
const entree = document.getElementById("codePost");
const boutonDeValidation = document.getElementById("validation");
const infosPrincipales = document.getElementById("infosPrincipales");
const tempMin = document.getElementById("tempMin");
const tempMax = document.getElementById("tempMax");
const probaPluie = document.getElementById("probaPluie");
const heureSol = document.getElementById("heureSol");
const nomCommune = document.getElementById("nomCommune");
const heureActuelle = document.getElementById("heureActuelle");
const indicationVille = document.getElementById("indicationVille");
const codePostal = document.getElementById("codePostal");
const titre = document.getElementById("titre");
const revenirArriere = document.getElementById("revenirArriere");
const ciel = document.getElementById("ciel");
const descriptionCiel = document.getElementById("descriptionCiel");
const temperatureActuelle = document.getElementById("temperatureActuelle");
const erreurCodePostal = document.getElementById("erreurCodePostal");
const contenu = document.getElementById("contenu");

const body = document.body;
const donneesSupplementaires = document.getElementById("donneesSupplementaires");
const latitude = document.getElementById("lat");
const cumulPluie = document.getElementById("cupluie")
const longitude = document.getElementById("long");

const ventMoyen = document.getElementById("vemoy");
const directionVent = document.getElementById("dirvent");
const parametres = document.getElementById("parametres");
const formulaire = document.getElementById("formulaire");
const annuler = document.getElementById("annuler");

const checkBox = document.getElementById("checkBox");
const latitudeCheckBox = document.getElementById("latitudeCheckBox");
const longitudeCheckBox = document.getElementById("longitudeCheckBox");
const cumulPluieCheckBox = document.getElementById("cumulPluieCheckBox");
const directionVentCheckBox = document.getElementById("directionVentCheckBox")
const ventMoyenCheckBox = document.getElementById("ventMoyenCheckBox");

const card = document.getElementById("WeatherCard");

let donneeParJour = [];
let donneeMeteo;
let valeurSoumise;

const pluieCanvas = document.getElementById("pluieCanvas");
const ctx = pluieCanvas.getContext('2d');

pluieCanvas.width = window.innerWidth * 1.5;
pluieCanvas.height = window.innerHeight * 1.5;
pluieCanvas.style.visibility = "hidden";
card.style.visibility = "hidden";

window.addEventListener('resize', () => {
    pluieCanvas.width = window.innerWidth * 1.5;
    pluieCanvas.height = window.innerHeight * 1.5;
    gouttes.length = 0;
});

const gouttes = [];

animateRain();


// date Aujourd'hui
let date = new Date();
var tableau_semaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
var tableau_mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
let datedAujourdhui;
let temps;

const token = "fdc3bc3227d4a88b39ad16fe2fc2d0947f30c5d7718ba9dc1c3660014b309bfc";

/* ------------------------------------------------------------- meteo pour I jours ------------------------------------------------------------------------------------------- */


const combienDeJours = document.getElementById("combienDeJours");
const selectionParJour = document.getElementById("selectionParJour");
let insee;


/**
* Permet de récupérer chaque donnée météo pour les 7 jours et de les placer dans les cards de ces jours
*
* @param codeInsee le code insee de la commune
*/

async function mettreDonneesMeteo(codeInsee) {
    const url = `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`;
    try {
    const response = await fetch(url);
    donneeMeteo = await response.json();
    mettreDonneesParJour();
    insee = codeInsee;

    } catch (error) {
    console.error(error.message);
    }
}

/**
 * Permet de placer chaque donnée dans les 7 jours
 */

function mettreDonneesParJour(){
    for (let i = 0; i<7; i++){
        donneeParJour[i] = donneeMeteo.forecast[i];
    }
}

combienDeJours.addEventListener("change", ()=>{  surCeJour(combienDeJours.value); });

/**
 * Permet d'ajouter les éléments div à chaque jour parmi les 7
 * 
 * @param i le jour correspondant
 */

function surCeJour(i){
    while (selectionParJour.hasChildNodes()) {
        selectionParJour.removeChild(selectionParJour.firstChild);
    }
    for (let j = 0; j<i; j++){
        ajouterDivisonJour(j);
    }
}


const jour1 = document.getElementById("jour1");

let dateEntiere;
let dateDeparts;
let jourSemaine;


/**
 * Permet d'ajouter les éléments divs et paragraphes et date aux 7 jours
 * 
 * @param j le jour correspondant
 */
function ajouterDivisonJour(j){ // j indice du tableau donneeParJour[]
    let nouvelleDivisonJour = document.createElement("div");
    let nouveauParagrapheMeteo = document.createElement("p");
    let nouveauParagrapheDate = document.createElement("p");
    let nouveauParagrapheImage = document.createElement("p");

    
    nouvelleDivisonJour.className="oneDay";

    nouvelleDivisonJour.id=="jour"+j;

    nouvelleDivisonJour.addEventListener("click",()=>{
        if ((date.getDay()+j) > 6){
            jourSemaine = tableau_semaine[date.getDay()+j-7];
        }
        else{
            jourSemaine = tableau_semaine[date.getDay()+j];
        }
        recupererDonneesMeteo(insee,j,jourSemaine);
        pluieCanvas.style.visibility = "hidden";

    },false)

    nouveauParagrapheMeteo.className="tempMinMax";
    nouveauParagrapheDate.className="dateParJour";
    nouveauParagrapheImage.className="imageParJour";

    descriptionMeteo (donneeParJour[j].weather, nouveauParagrapheImage);
    nouveauParagrapheMeteo.innerHTML = donneeParJour[j].tmin + "°/" + donneeParJour[j].tmax + "°";
    dateEntiere = donneeParJour[j].datetime.split('T');
    dateDeparts = dateEntiere[0].split("-");
    
    if ((date.getDay()+j) > 6){
        jourSemaine = tableau_semaine[date.getDay()+j-7];
    }
    else{
        jourSemaine = tableau_semaine[date.getDay()+j];
    }

    nouveauParagrapheDate.innerHTML = jourSemaine+ " " + dateDeparts[2] + "/" + dateDeparts[1];
    nouvelleDivisonJour.appendChild(nouveauParagrapheImage);
    nouvelleDivisonJour.appendChild(nouveauParagrapheMeteo);
    nouvelleDivisonJour.appendChild(nouveauParagrapheDate);
    selectionParJour.appendChild(nouvelleDivisonJour);
}


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

/**
 * Permet de récupérer les communes avec un code postal en paramètre tout en vérifiant son existance ou sa bonne écriture.
 * 
 * @param codePostal le codePostal de la commune
 */
async function recupererDonnees(codePostal) { // asynchrone pour exécuter tout le code et attendre la réponse 
    
    try{
        
        
        if(codePostal.trim() == ''){
            erreurCodePostal.innerText = "🚨 Vous avez rien saisi, veuillez saisir un nombre de 5 chiffres.";
            erreurCodePostal.style.visibility = "visible";
        }  
        else{
            if(verifPostalCode(codePostal) == 0){
                erreurCodePostal.innerText = "🚨 Le code postal n'est pas de la bonne forme. Il doit être de 5 chiffres."; 
                erreurCodePostal.style.visibility = "visible";
            }
            else{
                const result = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`); // Récupérer valeur de l'api
                const data = await result.json();
                if(data.length == 0){
                    erreurCodePostal.innerText = "🚨 Ce code postal n'existe pas.";
                    erreurCodePostal.style.visibility = "visible";
                }
                else{
                    
                    const optionDeBase = document.createElement("option");
                    optionDeBase.innerText = "Sélectionnez une commune";
                    validation.appendChild(optionDeBase)
                    data.forEach(element => { // Pour chaque élément de data
                        indicationVille.style.visibility ="visible";
                        const optionElement = document.createElement("option"); // on crée une option pour le select
                        optionElement.innerText = element.nom // on change son texte
                        validation.appendChild(optionElement) // on l'ajoute dans le select
                    });
                }
        }
            
        }
        
    }
    catch (error){
        console.error("Erreur");
    }
}

entree.addEventListener("input", () => {
    erreurCodePostal.style.visibility = "hidden"; // Masquer l'erreur dès que l'utilisateur tape quelque chose de nouveau
});

/**
 * Permet de vérifier la cohérence du code postal selon un regex
 * 
 * @param pc code postal de la commune
 */
function verifPostalCode(pc){
    const verifModelePc = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;
    if(verifModelePc.test(pc)){
        return 1;
    }
    return 0;
}

/**
 * Permet de valider une entrée de code postal avec un click.
 */
boutonDeValidation.addEventListener("click", ()=>{
    validation.innerText = "";
    valeurSoumise = entree.value;
    recupererDonnees(valeurSoumise);
});

/**
 * Permet de valider une entrée de code postal avec la touche entrée.
 */
entree.addEventListener("keypress", ()=>{
    validation.innerText = "";
    valeurSoumise = entree.value;
    recupererDonnees(valeurSoumise);
})

/**
 * Permet de récupérer le codeInsee d'une commune
 * 
 * @param nomCommune le nom de la commune
 */
async function recupererDonneesVille(nomCommune){
    try{
        const result = await fetch(`https://geo.api.gouv.fr/communes?nom=${nomCommune}&fields=departement`);
        const data = await result.json();
        const valeurInsee = data[0].code;
        recupererDonneesMeteo(valeurInsee,0,tableau_semaine[date.getDay()]);
        mettreDonneesMeteo(valeurInsee);
    }
    catch (error){
        console.error("Erreur nom de ville");
    }
}

validation.addEventListener("change", ()=>{
    const selectedIndex = validation.selectedIndex;
    const selectOption = validation.options[selectedIndex];
    recupererDonneesVille(selectOption.value)
})


/**
 * Peremt de récupérer les informations météos selon un jour précis entre 1 et 7 
 * 
 * @param codeInsee le codeInsee d'une commune
 * @param i le jour correspondant
 * @param dateSemaine la date 
 */
async function recupererDonneesMeteo(codeInsee,i,dateSemaine){
    try{ 

        const result = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`);
        const resultPeriod = await fetch(`https://api.meteo-concept.com/api/forecast/nextHours?token=${token}&insee=${codeInsee}`);
        const data = await result.json();
        let dataPeriod = await resultPeriod.json();
        const skyCommune = data.forecast[i].weather; 
        descriptionMeteo(skyCommune, ciel);
        const tempMinCommune = data.forecast[i].tmin;
        const tempMaxCommune = data.forecast[i].tmax;
        const probaRainCommune = data.forecast[i].probarain;
        const sun_hours = data.forecast[i].sun_hours;
        const nomVille = data.city.name;
        const longitudeCommune =(data.city.longitude); 
        const latitudeCommune = data.city.latitude;
        const ventMoyenCommune = data.forecast[i].wind10m;
        const directionVentCommune = data.forecast[i].dirwind10m;
        const cumulPluieCommune = data.forecast[i].rr10;
        if(i > 0){
            temperatureActuelle.innerText = " ";
        }
        else{
            const currentTemperatureCommune = dataPeriod.forecast[0].temp2m;
            temperatureActuelle.innerText = currentTemperatureCommune + '°';
        }       
        
        cumulPluie.innerText = cumulPluieCommune+"mm";
        ventMoyen.innerText = ventMoyenCommune+"km/h";
        directionVent.innerText = directionVentCommune+'°';
        latitude.innerText = latitudeCommune;
        longitude.innerText = longitudeCommune;
        nomCommune.innerText = nomVille;
        tempMin.innerText = tempMinCommune+'°';

        tempMax.innerText = tempMaxCommune+'°';
        probaPluie.innerText = probaRainCommune+'%';
        heureSol.innerText = sun_hours;      

        

        let minute = date.getMinutes() + "";
        if (minute.length == 1) { minute = "0"+minute;}
        temps = date.getHours() + "h" + minute;
        
        dateEntiere = data.forecast[i].datetime.split('T');
        dateDeparts = dateEntiere[0].split("-");
        heureActuelle.innerText = dateSemaine + " " + dateDeparts[2] + " " + tableau_mois[dateDeparts[1]] + ", " + temps;
        
        affichageInfos();
    }
    catch(error){
        console.error("Erreur Météo");
    }
}

/**
 * Permet d'afficher toutes les informations après avoir indiqué la commune
 */
function affichageInfos(){
    infosPrincipales.style.visibility = "visible";
    enleverAffichageCommune();
    PlacerInstantWeather();
    donneesSupplementaires.style.visibility = "visible";
    parametres.style.visibility ="visible";
    codePostal.style.position = "absolute";
    indicationVille.style.position ="absolute";
    card.style.visibility = "visible";
    selectionParJour.style.visibility ="visible";
    document.getElementById("choixParJour").style.visibility ="visible";

    verifCheckBox(latitudeCheckBox,lat,textLatitude)
    verifCheckBox(longitudeCheckBox,long,textLongitude)
    verifCheckBox(cumulPluieCheckBox,cupluie,textCuPluie)
    verifCheckBox(directionVentCheckBox,dirvent,textDirectionVent)
    verifCheckBox(ventMoyenCheckBox,vemoy,textVentMoyen)

}

/**
 * Permet de vérifier la checkBox et ses éléments cochées.
 */
function verifEncadrer(){
    if(latitudeCheckBox.checked == false && cumulPluieCheckBox.checked == false && directionVentCheckBox.checked ==false && longitudeCheckBox.checked == false && ventMoyenCheckBox.checked == false ){
        donneesSupplementaires.style.visibility ="hidden";
    }
    if(latitudeCheckBox.checked == false && longitudeCheckBox.checked == false){
        document.getElementById("carte").style.visibility ="hidden";
    }
    if(cumulPluieCheckBox.checked == false){
        document.getElementById("pluie").style.visibility ="hidden";
    }
    if(directionVentCheckBox.checked == false && ventMoyenCheckBox.checked == false){
        document.getElementById("vent").style.visibility ="hidden";
    }
}

/**
 * Permet de vérifier la checkbox et ses éléments cochées.
 */
function verifRemettreEncadrer(){
    if(latitudeCheckBox.checked == true || cumulPluieCheckBox.checked == true || directionVentCheckBox.checked == true || longitudeCheckBox.checked == true || ventMoyenCheckBox.checked == true){
        donneesSupplementaires.style.visibility ="visible";
    }
    if(latitudeCheckBox.checked == true || longitudeCheckBox.checked == true){
        document.getElementById("carte").style.visibility ="visible";
    }
    if(cumulPluieCheckBox.checked == true){
        document.getElementById("pluie").style.visibility ="visible";
    }
    if(directionVentCheckBox.checked == true || ventMoyenCheckBox.checked == true){
        document.getElementById("vent").style.visibility ="visible";
    }
}

/**
 * Permet de vérifier si un navigateur à reload la page ou non
 */
if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    latitudeCheckBox.checked = true;
    cumulPluieCheckBox.checked = true;
    directionVentCheckBox.checked = true;
    ventMoyenCheckBox.checked = true;
    longitudeCheckBox.checked = true;
    combienDeJours.value = combienDeJours.options[0].value;

} else {
    console.info( "This page is not reloaded");
}

/**
 * permet d'enlever l'affichage de base avec l'entrée du code postal
 */
function enleverAffichageCommune(){

    parametres.position ="";
    revenirArriere.position = "";
    infosPrincipales.style.position ="";
    donneesSupplementaires.style.position ="";
    document.getElementById("choixParJour").style.position ="";
    selectionParJour.style.position ="";
    contenu.style.position ="absolute";

    indicationVille.style.visibility = "hidden";
    codePostal.style.visibility = "hidden";
    contenu.style.visibility = "hidden";
    revenirArriere.style.visibility = "visible";
}

/**
 * Petite fonction qui permet de placer le titre
 */
function PlacerInstantWeather(){
    titre.style.marginTop = "5%";
}

const textLatitude = document.getElementById("texteLatitude");
const textLongitude = document.getElementById("texteLongitude");
const textCuPluie = document.getElementById("texteCuPluie");
const textVentMoyen = document.getElementById("texteVentMoyen");
const textDirectionVent = document.getElementById("texteDirectionVent");

const carte = document.getElementById("carte");
const pluie = document.getElementById("pluie");
const vent = document.getElementById("vent");


/**
 * Permet de revenir à l'affichage de départ où l'on rentre la commune et le code postal
 */
function remettreAffichageCommune(){
    
    revenirArriere.position ="absolute";
    parametres.position ="absolute";
    infosPrincipales.style.position = "absolute";
    donneesSupplementaires.style.position ="absolute";
    document.getElementById("choixParJour").style.position ="absolute";
    selectionParJour.style.position = "absolute";
    contenu.style.position ="";
    pluieCanvas.style.visibility ="hidden";

    indicationVille.style.visibility = "visible";
    codePostal.style.visibility ="visible";
    revenirArriere.style.visibility ="hidden";
    infosPrincipales.style.visibility = "hidden";
    titre.style.marginTop = "15%";
    body.style.backgroundColor= "#58ABB0";
    indicationVille.style.visibility = "hidden";
    codePostal.style.position = "";
    indicationVille.style.position ="";
    parametres.style.visibility ="hidden";
    formulaire.style.visibility ="hidden";
    contenu.style.visibility="visible";

    carte.style.visibility ="hidden";
    pluie.style.visibility ="hidden";
    vent.style.visibility ="hidden";

    latitude.style.visibility ="hidden";
    cumulPluie.style.visibility ="hidden";
    longitude.style.visibility ="hidden";
    ventMoyen.style.visibility ="hidden";
    directionVent.style.visibility ="hidden";

    textLatitude.style.visibility ="hidden";
    textLongitude.style.visibility ="hidden";
    textCuPluie.style.visibility ="hidden";
    textVentMoyen.style.visibility ="hidden";
    textDirectionVent.style.visibility ="hidden";

    selectionParJour.style.visibility ="hidden";
    donneesSupplementaires.style.visibility="hidden";
    document.getElementById("choixParJour").style.visibility ="hidden";

}

/**
 * Permet de revenir en arrière donc à l'affichage de départ.
 */
revenirArriere.addEventListener("click",()=>{
    remettreAffichageCommune();
    combienDeJours.value = combienDeJours.options[0].value;
    surCeJour(combienDeJours.value);
    card.style.visibility = "hidden";
})

/**
 * Permet de récupérer la description météo et de changer le background et les icones en fonction
 * 
 * @param s le temps actuel 
 * @param meteo la meteo de l'api pour connaitre le temps
 */
function descriptionMeteo (meteo, s){
    if(meteo == 0){
        s.innerHTML = '<i class="fa-regular fa-sun"></i>';
        if (s == ciel){ body.style.backgroundColor ="#80DDE3"; 
            formulaire.style.backgroundColor ="#80DDE3";
            descriptionCiel.innerText = "Ensoleillé";
        }
    } 
    if((meteo >= 1 && meteo <= 5) || (meteo == 16) ){
        s.innerHTML = '<i class="fa-solid fa-cloud"></i>';
        if (s == ciel){ body.style.backgroundColor="#6FB8BD";
            formulaire.style.backgroundColor ="#6FB8BD"; 
            descriptionCiel.innerText = "Nuageux";
        }
    }
    if(meteo >= 6 && meteo <= 7 ){
        s.innerHTML = '<i class="fa-solid fa-smog"></i>';
        if (s == ciel){ body.style.backgroundColor = "#59989C";
            formulaire.style.backgroundColor ="#59989C"; 
            descriptionCiel.innerText = "Brumeux"
        }
    }
    if((meteo >= 10 && meteo <= 15) || (meteo >= 40 && meteo <= 48) || (meteo >= 210 && meteo <= 212) || (meteo == 235)){
        s.innerHTML =  '<i class="fa-solid fa-cloud-rain"></i>';
        if (s == ciel){ 
            pluieCanvas.style.visibility = "visible";
            body.style.backgroundColor = "#496769";
            formulaire.style.backgroundColor ="#496769";
            descriptionCiel.innerText = "Pluvieux"
        }
    }
    if((meteo >= 20 && meteo <= 22 ) || (meteo >= 30 && meteo <= 32) ||  (meteo >= 60 && meteo <= 68) || (meteo >= 70 && meteo <= 78) || (meteo >= 220 && meteo <= 2022) || (meteo >= 230 && meteo <= 232)){
        s.innerHTML = '<i class="fa-solid fa-snowflake"></i>'
        if (s == ciel){ body.style.backgroundColor = "#8BA1A3"; 
            formulaire.style.backgroundColor ="#8BA1A3"; 
            descriptionCiel.innerText = "Enneigé"
    }
    }
    if((meteo >= 100 && meteo <= 108) || (meteo >= 120 && meteo <= 142)){
        s.innerHTML = '<i class="fa-solid fa-poo-storm"></i>';
        if (s == ciel){ 
            body.style.backgroundColor = "#302A2A"; 
            formulaire.style.backgroundColor ="#302A2A";
            descriptionCiel.innerText = "Orageux"
        }  
    }     
}

parametres.addEventListener("click",()=>{
    formulaire.style.visibility="visible";
})

annuler.addEventListener("click",()=>{
    formulaire.style.visibility="hidden";
})

/**
 * Permet de savoir si une checkbox est coché ou non et permet d'afficher les valeurs concernées ou non.
 * 
 * @param checkBox la checkBox à vérifier parmi les 5
 * @param value la valeur de la checkBox
 * @param text le texte à verifier dans cette checkBox
 */
function verifCheckBox(checkBox,value,text){
    if(checkBox.checked == false){
        value.style.visibility = "hidden";
        text.style.visibility ="hidden";
        verifEncadrer();
    }
    else{
        value.style.visibility = "visible";
        text.style.visibility ="visible";
        verifRemettreEncadrer();
    }
}


/**
 * Permet de créer la pluie sur le Canvas
 */
function creerPluie(){
    const x = Math.random() * pluieCanvas.width;
    const y = 0;
    const speed = Math.random() * 5 + 2;
    const length = Math.random() * 20 + 10;

    gouttes.push({x, y, speed, length});
}

/**
 * Permet de mettre à jour la pluie à chaque instant.
 */
function mettreAJourPluie(){
    for(let i = 0; i < gouttes.length; i++){
        const goutte = gouttes[i];

        goutte.y += goutte.speed;

        if(goutte.y > pluieCanvas.height){
            gouttes.splice(i,1);
            i--;
        }
    }
}

/**
 * Permet de dessiner les goutes d'eau de la pluie sur le Canvas
 */
function dessinerPluie(){
    ctx.clearRect(0, 0, pluieCanvas.width, pluieCanvas.height);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    for(let i = 0; i<gouttes.length; i++){
        const goutte = gouttes[i];

        ctx.beginPath();
        ctx.moveTo(goutte.x, goutte.y);
        ctx.lineTo(goutte.x, goutte.y + goutte.length);
        ctx.stroke();
    }

}

/**
 * Permet d'animer la pluie pour qu'elle soit dynamique
 */
function animateRain(){
    creerPluie();
    mettreAJourPluie();
    dessinerPluie();
    requestAnimationFrame(animateRain);
}



