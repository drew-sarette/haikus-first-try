// Globals ==============================================================
const haiku = [];
let isHaikuValid = false;
const PORT = 5001;

const haikuContainer = document.getElementById("haiku-container");
const line1 = document.getElementById("line-1");
const line2 = document.getElementById("line-2");
const line3 = document.getElementById("line-3");
const currentWordInput = document.getElementById("current-word");
const synonymContainer = document.getElementById("synonym-container");
const synonymPopup = document.getElementById("synonym-popup");

// Event Listeners =====================================================
document.getElementById("menu-btn").addEventListener("click", toggleMenu);
document.getElementById("hide-synonyms").addEventListener("click", hideSynonyms);
document.getElementById("close-form").addEventListener("click", closeSubmitForm);
document.getElementById("done").addEventListener("click", showSubmitForm);
document.getElementById("clear").addEventListener("click", clearHaiku);


// Basic page functionality ============================================
function toggleMenu() {
    document.querySelector("nav").classList.toggle("display-none");
}

function hideSynonyms() {
    synonymPopup.classList.add("display-none");
    synonymContainer.innerHTML = null;
}

function showSubmitForm() {
    if (isHaikuValid) {
        document.getElementById("form-popup").classList.remove("display-none");
    } else {
        alert("Please enter a 5-7-5 haiku.");
    }
}

function closeSubmitForm(ev) {
    document.getElementById("form-popup").classList.add("display-none");
}

function clearHaiku() {
    currentWordInput.value = "";
    hideSynonyms();
    while (haiku.length) { haiku.pop(); } // haiku = [] doesn't work?
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
    // const endpoint = new URL(`http://localhost:${PORT}/${word}`);
    // const response = await fetch(endpoint);
    // const result = await response.json();
    // return result.data;
    return {
        word: "test",
        syllables: 1,
        synonyms: ["quiz", "trial"]
    }
}

async function addWord(wordToAdd) {

    if (wordToAdd.trim()) {
        const newWordObj = await lookUp(wordToAdd);
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

function checkHaiku() {
    let [isFirstLineValid, isSecondLineValid, isThirdLineValid] = [false, false, false];
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
    if (isThirdLineValid) {
        isHaikuValid = true;
    } else {
        isHaikuValid = false;
    }
    return [isFirstLineValid, isSecondLineValid, isThirdLineValid];
}

function updateHaikuDisplay() {
    document.querySelectorAll("span").forEach(span => span.parentElement.removeChild(span));
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
        if (haiku.length > 0) {
            haiku[haiku.length - 1].htmlElement.insertAdjacentElement('afterend', currentWordInput);
            currentWordInput.focus();
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
    synonymPopup.classList.remove("display-none");
}

async function substituteSynonym(synonym, index) {
    const wordObj = await lookUp(synonym);
    const newSpan = document.createElement("span");
    newSpan.classList.add("haiku-word");
    newSpan.addEventListener("click", () => showSynonyms(wordObj.synonyms, index));
    newSpan.textContent = synonym;
    wordObj.htmlElement = newSpan;
    haiku[index] = wordObj;
    updateHaikuDisplay();
    hideSynonyms();
}