import { haikuRepo } from './haikuRepo.js';
// Globals ==============================================================
//const haiku = [];
let isHaikuValid = true;

const haikuContainer = document.getElementById("haiku-container");
const line1 = document.getElementById("line-1");
const line2 = document.getElementById("line-2");
const line3 = document.getElementById("line-3");
const currentWordInput = document.getElementById("current-word");
const synonymContainer = document.getElementById("synonym-container");
const PORT = 5001;

// Basic page functionality ============================================
function toggleMenu() {
    document.querySelector("nav").classList.toggle("display-none");
}

function showSubmitForm() {
    if (isHaikuValid) {
        document.querySelector("form").classList.toggle("display-none");
    } else {
        alert("Please enter a 5-7-5 haiku.");
    }
}

function closeSubmitForm(ev) {
    document.querySelector("form").classList.toggle("display-none");
}

function clearHaiku() {
    currentWordInput.value = "";
    line1.innerHTML = null;
    line2.innerHTML = null;
    line3.innerHTML = null;
    synonymContainer.innerHTML = null;
    synonymContainer.classList.add("display-none");
    haikuRepo.eraseHaiku();

}

// Haiku input ===========================================================

currentWordInput.addEventListener("keydown", ev => {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.code === "Space" || ev.code === "Enter") {
        addWord(currentWordInput.value.trim().toLowerCase());
        currentWordInput.value = "";
    }
    else if (ev.code === "Backspace") {
        deleteLastWord();

    }
    else {
        console.log(ev.key);
        currentWordInput.value += ev.key;
    }
});

async function lookUp(word) {
    const endpoint = new URL(`http://localhost:${PORT}/${word}`);
    const response = await fetch(endpoint);
    const result = await response.json();
    return result.data;
    // return {
    //     word: "test",
    //     syllables: 3,
    //     synonyms: ["quiz", "trial"]
    // }
}

async function addWord(wordToAdd) {

    if (wordToAdd.trim()) {
        let newWordObj = await lookUp(wordToAdd);
        const newSpan = document.createElement("span");
        newSpan.textContent = wordToAdd;
        newSpan.classList.add("haiku-word");
        newWordObj.htmlElement = newSpan;

        let newIndex = haikuRepo.getHaiku().length;
        newWordObj.htmlElement.addEventListener("click", () => showSynonyms(newWordObj.synonyms, newIndex));
        haikuRepo.addWord(newWordObj);
        updateHaikuDisplay();
    }

}

function deleteLastWord() {
    if (currentWordInput.value.trim() != "") {
        currentWordInput.value = null;
    } else {
        haikuRepo.deleteLastWord()
        updateHaikuDisplay();
    }
}

function updateHaikuDisplay() {
    const haiku = haikuRepo.getHaiku();
    console.log(haiku);
    line1.innerHTML = null;
    line2.innerHTML = null;
    line3.innerHTML = null;
    const [line1IsValid, line2IsValid, line3IsValid] = haikuRepo.checkHaiku();
    let runningSyllableCount = 0;
    for (let i = 0; i < haiku.length; i++) {
        runningSyllableCount += haiku[i].syllables;
        if (runningSyllableCount < 6) {
            if (line1IsValid) {
                haiku[i].htmlElement.classList.add("valid-word");
            } else {
                haiku[i].htmlElement.classList.remove("valid-word");
            }
            line1.appendChild(haiku[i].htmlElement);
        } else if (runningSyllableCount < 13) {
            if (line2IsValid) {
                haiku[i].htmlElement.classList.add("valid-word");
            } else {
                haiku[i].htmlElement.classList.remove("valid-word");
            }
            line2.appendChild(haiku[i].htmlElement);
        } else if (runningSyllableCount < 18) {
            if (line3IsValid) {
                haiku[i].htmlElement.classList.add("valid-word");
            } else {
                haiku[i].htmlElement.classList.remove("valid-word");
            }
            line3.appendChild(haiku[i].htmlElement);
        } else {
            haiku[i].htmlElement.classList.remove("valid-word")
            line3.appendChild(haiku[i].htmlElement);
        }
    }
}

function showSynonyms(arrOfSynonyms, index) {
    synonymContainer.innerHTML = null;
    arrOfSynonyms.forEach(synonym => {
        const btn = document.createElement("btn");
        btn.textContent = synonym;
        btn.classList.add("synonym-button");

        btn.addEventListener("click", () => substituteSynonym(synonym, index));
        synonymContainer.appendChild(btn);
    });
    synonymContainer.classList.remove("display-none");
}

async function substituteSynonym(synonym, index) {
    const wordObj = await lookUp(synonym);
    wordObj.htmlElement.addEventListener("click", () => showSynonyms(wordObj.synonyms, index));
    haikuRepo.substituteSynonym(wordObj, index)
    updateHaikuDisplay();
    synonymContainer.classList.add("display-none");
    synonymContainer.innerHTML = null;
}