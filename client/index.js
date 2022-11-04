// Globals
const haiku = [];
const haikuContainer = document.getElementById("haiku-container");
const currentWordInput = document.getElementById("current-word");
const synonymContainer = document.getElementById("synonyms");

// Basic page functionality
function toggleMenu() {
    document.querySelector("nav").classList.toggle("display-none");
}

function showSubmitForm() {
    document.querySelector("form").classList.toggle("display-none");
}

function closeSubmitForm(ev) {
    // ev.preventDefault();
    document.querySelector("form").classList.toggle("display-none");
}

function clearHaiku() {
    currentWordInput.value = "";
    while (haiku.length > 0) {
        haikuContainer.removeChild(haiku.pop().htmlElement);
    }
}

// Haiku input

currentWordInput.addEventListener("keydown", ev => {
    if (ev.code === "Space") { 
        addWord(currentWordInput.value);
    } else if (ev.code === "Backspace") {
        deleteLastWord();
    }
});

function addWord(wordToAdd) {
    // verify valid input
    // fetch syllables, synonyms from server
    const divToAppend = document.createElement("div");
    divToAppend.textContent = wordToAdd;
    divToAppend.classList.add("haiku-word");
    const newWordObj = {
        word: wordToAdd,
        syllables: 2,
        synonyms: ["dummy", "dummy2", "dummy3"],
        htmlElement: divToAppend
    }
    newWordObj.htmlElement.addEventListener("click", () => showSynonyms(newWordObj));
    haiku.push(newWordObj);
    haikuContainer.appendChild(newWordObj.htmlElement);
    currentWordInput.value = "";
}

function deleteLastWord() {
    if (currentWordInput.value != "") {
        currentWordInput.value = "";
    } else {
        haikuContainer.removeChild(haiku.pop().htmlElement);
    }
}

function showSynonyms(wordObj) {
    //wordObj is the original newWordObj saved in a closure!
    synonymContainer.innerHTML = "";
    const listOfSynonyms = wordObj.synonyms;
    for (synonym of listOfSynonyms){
        const synonymButton = document.createElement("button");
        synonymButton.textContent = synonym;
        synonymButton.addEventListener("click", () => substituteSynonym(synonym, wordObj));
        synonymContainer.appendChild(synonymButton);
    }
    synonymContainer.classList.toggle("display-none");
}

function substituteSynonym(wordToSubstitute, originalWordObj) {
    // fetch syllables and synonyms of wordToSubstitute from server
    const changedWordDiv = document.createElement("div");
    changedWordDiv.textContent = wordToSubstitute;
    changedWordDiv.classList.add("haiku-word");
    const changedWordObj = {  
        word: wordToSubstitute,
        syllables: 2,
        synonyms: ["dummy", "dummy2", "dummy3"],
        htmlElement: changedWordDiv
    }
    originalWordObj.htmlElement = changedWordDiv;
    alert(originalWordObj.htmlElement.textContent);
    haiku[haiku.indexOf(originalWordObj)] = changedWordObj;
}