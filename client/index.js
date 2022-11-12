// Globals ==============================================================
const haiku = [];
let isHaikuValid = false;

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
    haiku = [];
    updateHaikuDisplay();
}

// Haiku input ===========================================================

currentWordInput.addEventListener("keydown", function (ev) {
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
    //     syllables: 1,
    //     synonyms: ["quiz", "trial"]
    // }
}

async function addWord(wordToAdd) {

    if (wordToAdd.trim()) {
        let newWordObj = await lookUp(wordToAdd);
        const newSpan = document.createElement("span");
        newSpan.textContent = newWordObj.word;
        newSpan.classList.add("haiku-word");
        newWordObj.htmlElement = newSpan;
        let newIndex = haiku.length;
        newWordObj.htmlElement.addEventListener("click", () => showSynonyms(newWordObj.synonyms, newIndex));
        haiku.push(newWordObj);
        updateHaikuDisplay();
    }

}

function deleteLastWord() {
    if (currentWordInput.value.trim() != "") {
        currentWordInput.value = null;
    } else {
        haiku.pop();
        updateHaikuDisplay();
    }
}

function checkHaiku () {
    let isFirstLineValid = false;
    let isSecondLineValid = false;
    let isThirdLineValid = false;
    let runningSyllableCount = 0;
    for (word of haiku) {
        runningSyllableCount += word.syllables;
        if (runningSyllableCount === 5) {
            isFirstLineValid = true;
        } else if (runningSyllableCount === 12 && isFirstLineValid) {
            isSecondLineValid = true;
        } else if (runningSyllableCount === 17 && isSecondLineValid) {
            isThirdLineValid = true;
        } else if (runningSyllableCount > 17)
            isThirdLineValid = false;
    }
    if (isFirstLineValid && isSecondLineValid && isThirdLineValid) {
        isHaikuValid = true;
    } else {
        isHaikuValid = false;
    }
    return [isFirstLineValid, isSecondLineValid, isThirdLineValid];
}

function updateHaikuDisplay() {
    line1.innerHTML = null;
    line2.innerHTML = null;
    line3.innerHTML = null;
    const [line1IsValid, line2IsValid, line3IsValid] = checkHaiku();
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
    const newSpan = document.createElement("span");
    newSpan.classList.add("haiku-word");
    newSpan.addEventListener("click", () => showSynonyms(wordObj.synonyms, index));
    newSpan.textContent = synonym;
    wordObj.htmlElement = newSpan;
    console.log(wordObj);
    haiku[index] = wordObj;
    updateHaikuDisplay();
    synonymContainer.classList.add("display-none");
    synonymContainer.innerHTML = null;
}