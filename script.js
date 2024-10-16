const validation = document.getElementById("ville");
const input = document.getElementById("postcode");
const submitButton = document.getElementById("submit");
const infoMain = document.getElementById("infoMain");
const tempMin = document.getElementById("tempMin");
const tempMax = document.getElementById("tempMax");
const probaRain = document.getElementById("probaRain");
const heureSol = document.getElementById("heureSol");
const nomCommune = document.getElementById("nomCommune");
const heureActuelle = document.getElementById("heureActuelle");
const selectionCity = document.getElementById("city");
const codePostal = document.getElementById("postalCode");
const title = document.getElementById("title");
const revenirArriere = document.getElementById("revenirArriere");
const sky = document.getElementById("sky");
const skyDescription = document.getElementById("skyDescription");
const currentTemperature = document.getElementById("currentTemperature");
const errorPostalCode = document.getElementById("errorPostalCode");
const content = document.getElementById("content");

const body = document.body;
const supData = document.getElementById("supData");
const latitude = document.getElementById("lat");
const cumulPluie = document.getElementById("cupluie")
const longitude = document.getElementById("long");

const ventMoyen = document.getElementById("vemoy");
const directionVent = document.getElementById("dirvent");
const settings = document.getElementById("settings");
const formulaire = document.getElementById("formulaire");
const cancel = document.getElementById("cancel");

const checkBox = document.getElementById("checkBox");
const latitudeCheckBox = document.getElementById("latitudeCheckBox");
const longitudeCheckBox = document.getElementById("longitudeCheckBox");
const cumulPluieCheckBox = document.getElementById("cumulPluieCheckBox");
const directionVentCheckBox = document.getElementById("directionVentCheckBox")
const ventMoyenCheckBox = document.getElementById("ventMoyenCheckBox");

let dataPerDay = [];
let dataWeather;
let valeurInput;

let dataHoraire;



// today date
let date = new Date();
var tab_week = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
var tab_month = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
let todayDate;
let time;

//const token = "4fc5437cc97af368607aa51c5e24da9d2d95835be19cd8fecb0d37d29a0c3382";
//const token = "692bfe589118b1db61eedbd9a9aeecf8ee0f42d8a3c9e128ac454cc13e65f53e";
//const token = "ced3b5dd9813f00f0be2ac7c73d561438f2786cc96434a7850bed685692a6f0e";
const token = "fdc3bc3227d4a88b39ad16fe2fc2d0947f30c5d7718ba9dc1c3660014b309bfc";

/* ------------------------------------------------------------- WEATHER FOR I DAYS ------------------------------------------------------------------------------------------- */


const howManyDays = document.getElementById("howManyDays");
const selectPerDay = document.getElementById("selectPerDay");
let insee;

async function setDataWeather(codeInsee) {
    const url = `https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`;
    try {
    const response = await fetch(url);
    dataWeather = await response.json();
    setDataPerDay();
    insee = codeInsee;

    } catch (error) {
    console.error(error.message);
    }
}

function setDataPerDay(){
    for (let i = 0; i<7; i++){
        dataPerDay[i] = dataWeather.forecast[i];
    }
}

howManyDays.addEventListener("change", ()=>{  onIDays(howManyDays.value); });

function onIDays(i){
    while (selectPerDay.hasChildNodes()) {
        selectPerDay.removeChild(selectPerDay.firstChild);
    }
    for (let j = 0; j<i; j++){
        addDivDay(j);
    }
}


const day1 = document.getElementById("day1");

let wholeDate;
let date3parts;
let jourSemaine;

function addDivDay(j){ // j indice du tableau dataPerDay[]
    let newDivDay = document.createElement("div");
    let newPWeather = document.createElement("p");
    let newPDate = document.createElement("p");
    let newPImage = document.createElement("p");

    
    newDivDay.className="oneDay";

    newDivDay.id=="day"+j;

    newDivDay.addEventListener("click",()=>{
        if ((date.getDay()+j) > 6){
            jourSemaine = tab_week[date.getDay()+j-7];
        }
        else{
            jourSemaine = tab_week[date.getDay()+j];
        }
        fetchDataMeteo(insee,j,jourSemaine);

    },false)

    newPWeather.className="tempMinMax";
    newPDate.className="datePerDay";
    newPImage.className="imagePerDay";

    weatherDescriptions (dataPerDay[j].weather, newPImage);
    newPWeather.innerHTML = dataPerDay[j].tmin + "°/" + dataPerDay[j].tmax + "°";
    wholeDate = dataPerDay[j].datetime.split('T');
    date3parts = wholeDate[0].split("-");
    
    if ((date.getDay()+j) > 6){
        jourSemaine = tab_week[date.getDay()+j-7];
    }
    else{
        jourSemaine = tab_week[date.getDay()+j];
    }

    newPDate.innerHTML = jourSemaine+ " " + date3parts[2] + "/" + date3parts[1];
    newDivDay.appendChild(newPImage);
    newDivDay.appendChild(newPWeather);
    newDivDay.appendChild(newPDate);
    selectPerDay.appendChild(newDivDay);
}


/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------ */

async function fetchData(codePostal) { // asynchrone pour exécuter tout le code et attendre la réponse 
    
    try{
        
        
        if(codePostal.trim() == ''){
            errorPostalCode.innerText = "🚨 Vous avez rien saisi, veuillez saisir un nombre de 5 chiffres.";
            errorPostalCode.style.visibility = "visible";
        }  
        else{
            if(verifPostalCode(codePostal) == 0){
                errorPostalCode.innerText = "🚨 Le code postal n'est pas de la bonne forme. Il doit être de 5 chiffres."; 
                errorPostalCode.style.visibility = "visible";
            }
            else{
                const result = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${codePostal}`); // Récupérer valeur de l'api
                const data = await result.json();
                if(data.length == 0){
                    errorPostalCode.innerText = "🚨 Ce code postal n'existe pas.";
                    errorPostalCode.style.visibility = "visible";
                }
                else{
                    
                    const optionDeBase = document.createElement("option");
                    optionDeBase.innerText = "Sélectionnez une commune";
                    validation.appendChild(optionDeBase)
                    data.forEach(element => { // Pour chaque élément de data
                        city.style.visibility ="visible";
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

input.addEventListener("input", () => {
    errorPostalCode.style.visibility = "hidden"; // Masquer l'erreur dès que l'utilisateur tape quelque chose de nouveau
});

function verifPostalCode(pc){
    const verifModelePc = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;
    if(verifModelePc.test(pc)){
        return 1;
    }
    return 0;
}

submitButton.addEventListener("click", ()=>{
    validation.innerText = "";
    valeurInput = input.value;
    fetchData(valeurInput);
    
});

async function fetchDataNomVille(nomCommune){
    try{
        const result = await fetch(`https://geo.api.gouv.fr/communes?nom=${nomCommune}&fields=departement`);
        const data = await result.json();
        const valeurInsee = data[0].code;
        fetchDataMeteo(valeurInsee,0,tab_week[date.getDay()]);
        setDataWeather(valeurInsee);
    }
    catch (error){
        console.error("Erreur nom de ville");
    }
}

validation.addEventListener("change", ()=>{
    const selectedIndex = validation.selectedIndex;
    const selectOption = validation.options[selectedIndex];
    fetchDataNomVille(selectOption.value)
   
})

async function fetchDataMeteo(codeInsee,i,dateSemaine){
    try{ 

        const result = await fetch(`https://api.meteo-concept.com/api/forecast/daily?token=${token}&insee=${codeInsee}`);
        const resultPeriod = await fetch(`https://api.meteo-concept.com/api/forecast/nextHours?token=${token}&insee=${codeInsee}`);
        const data = await result.json();
        let dataPeriod = await resultPeriod.json();
        const skyCommune = data.forecast[i].weather; 
    
        weatherDescriptions(skyCommune, sky);

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
            currentTemperature.innerText = " ";
        }
        else{
            const currentTemperatureCommune = dataPeriod.forecast[0].temp2m;
            currentTemperature.innerText = currentTemperatureCommune + '°';
        }       
        
        cumulPluie.innerText = cumulPluieCommune+"mm";
        ventMoyen.innerText = ventMoyenCommune+"km/h";
        directionVent.innerText = directionVentCommune+'°';
        latitude.innerText = latitudeCommune;
        longitude.innerText = longitudeCommune;
        nomCommune.innerText = nomVille;
        tempMin.innerText = tempMinCommune+'°';
      

        tempMax.innerText = tempMaxCommune+'°';
        probaRain.innerText = probaRainCommune+'%';
        heureSol.innerText = sun_hours;      

        

        let minute = date.getMinutes() + "";
        if (minute.length == 1) { minute = "0"+minute;}
        time = date.getHours() + "h" + minute;
      
        
        wholeDate = data.forecast[i].datetime.split('T');
        date3parts = wholeDate[0].split("-");
        heureActuelle.innerText = dateSemaine + " " + date3parts[2] + " " + tab_month[date3parts[1]] + ", " + time;
        
        affichageInfos();
    }
    catch(error){
        console.error("Erreur Météo");
    }
}

function affichageInfos(){
    infoMain.style.visibility = "visible";
    enleverAffichageCommune();
    InstantWeatherPlacer();
    supData.style.visibility = "visible";
    settings.style.visibility ="visible";
    codePostal.style.position = "absolute";
    city.style.position ="absolute";
    selectPerDay.style.visibility ="visible";
    document.getElementById("choosePerDay").style.visibility ="visible";

    verifCheckBox(latitudeCheckBox,lat,textLatitude)
    verifCheckBox(longitudeCheckBox,long,textLongitude)
    verifCheckBox(cumulPluieCheckBox,cupluie,textCuPluie)
    verifCheckBox(directionVentCheckBox,dirvent,textDirectionVent)
    verifCheckBox(ventMoyenCheckBox,vemoy,textVentMoyen)

}

function verifEncadrer(){
    if(latitudeCheckBox.checked == false && cumulPluieCheckBox.checked == false && directionVentCheckBox.checked ==false && longitudeCheckBox.checked == false && ventMoyenCheckBox.checked == false ){
        supData.style.visibility ="hidden";
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

function verifRemettreEncadrer(){
    if(latitudeCheckBox.checked == true || cumulPluieCheckBox.checked == true || directionVentCheckBox.checked == true || longitudeCheckBox.checked == true || ventMoyenCheckBox.checked == true){
        supData.style.visibility ="visible";
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

if (performance.navigation.type == performance.navigation.TYPE_RELOAD) {
    latitudeCheckBox.checked = true;
    cumulPluieCheckBox.checked = true;
    directionVentCheckBox.checked = true;
    ventMoyenCheckBox.checked = true;
    longitudeCheckBox.checked = true;
    howManyDays.value = howManyDays.options[0].value;

  } else {
    console.info( "This page is not reloaded");
}

function enleverAffichageCommune(){

    settings.position ="";
    revenirArriere.position = "";
    infoMain.style.position ="";
    supData.style.position ="";
    document.getElementById("choosePerDay").style.position ="";
    selectPerDay.style.position ="";
    content.style.position ="absolute";

    city.style.visibility = "hidden";
    codePostal.style.visibility = "hidden";
    content.style.visibility = "hidden";
    revenirArriere.style.visibility = "visible";
}

function InstantWeatherPlacer(){
    title.style.marginTop = "5%";
}

const textLatitude = document.getElementById("textLatitude");
const textLongitude = document.getElementById("textLongitude");
const textCuPluie = document.getElementById("textCuPluie");
const textVentMoyen = document.getElementById("textVentMoyen");
const textDirectionVent = document.getElementById("textDirectionVent");

const carte = document.getElementById("carte");
const pluie = document.getElementById("pluie");
const vent = document.getElementById("vent");

function remettreAffichageCommune(){
    
    revenirArriere.position ="absolute";
    settings.position ="absolute";
    infoMain.style.position = "absolute";
    supData.style.position ="absolute";
    document.getElementById("choosePerDay").style.position ="absolute";
    selectPerDay.style.position = "absolute";
    content.style.position ="";

    city.style.visibility = "visible";
    codePostal.style.visibility ="visible";
    revenirArriere.style.visibility ="hidden";
    infoMain.style.visibility = "hidden";
    title.style.marginTop = "15%";
    body.style.backgroundColor= "#58ABB0";
    selectionCity.style.visibility = "hidden";
    codePostal.style.position = "";
    city.style.position ="";
    settings.style.visibility ="hidden";
    formulaire.style.visibility ="hidden";
    content.style.visibility="visible";

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

    selectPerDay.style.visibility ="hidden";
    supData.style.visibility="hidden";
    document.getElementById("choosePerDay").style.visibility ="hidden";

}

revenirArriere.addEventListener("click",()=>{
    remettreAffichageCommune();
    howManyDays.value = howManyDays.options[0].value;
    onIDays(howManyDays.value);
})


function weatherDescriptions (weather, s){
    if(weather == 0){
        s.innerHTML = '<i class="fa-regular fa-sun"></i>';
        if (s == sky){ body.style.backgroundColor ="#80DDE3"; 
          formulaire.style.backgroundColor ="#80DDE3";
          skyDescription.innerText = "Ensoleillé";
        }
    } 
    if((weather >= 1 && weather <= 5) || (weather == 16) ){
        s.innerHTML = '<i class="fa-solid fa-cloud"></i>';
        if (s == sky){ body.style.backgroundColor="#6FB8BD";
            formulaire.style.backgroundColor ="#6FB8BD"; 
            skyDescription.innerText = "Nuageux";
        }
    }
    if(weather >= 6 && weather <= 7 ){
        s.innerHTML = '<i class="fa-solid fa-smog"></i>';
        if (s == sky){ body.style.backgroundColor = "#59989C";
          formulaire.style.backgroundColor ="#59989C"; 
          skyDescription.innerText = "Brumeux"
        }
    }
    if((weather >= 10 && weather <= 15) || (weather >= 40 && weather <= 48) || (weather >= 210 && weather <= 212) || (weather == 235)){
        s.innerHTML =  '<i class="fa-solid fa-cloud-rain"></i>';
        if (s == sky){ 
          body.style.backgroundColor = "#496769";
          formulaire.style.backgroundColor ="#496769";
          skyDescription.innerText = "Pluvieux"
        }
    }
    if((weather >= 20 && weather <= 22 ) || (weather >= 30 && weather <= 32) ||  (weather >= 60 && weather <= 68) || (weather >= 70 && weather <= 78) || (weather >= 220 && weather <= 2022) || (weather >= 230 && weather <= 232)){
        s.innerHTML = '<i class="fa-solid fa-snowflake"></i>'
        if (s == sky){ body.style.backgroundColor = "#8BA1A3"; 
        formulaire.style.backgroundColor ="#8BA1A3"; 
        skyDescription.innerText = "Enneigé"
    }
    }
    if((weather >= 100 && weather <= 108) || (weather >= 120 && weather <= 142)){
        s.innerHTML = '<i class="fa-solid fa-poo-storm"></i>';
        if (s == sky){ 
          body.style.backgroundColor = "#302A2A"; 
          formulaire.style.backgroundColor ="#302A2A";
          skyDescription.innerText = "Orageux"
        }  
    }     
}

settings.addEventListener("click",()=>{
    formulaire.style.visibility="visible";
})

cancel.addEventListener("click",()=>{
    formulaire.style.visibility="hidden";
})


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





