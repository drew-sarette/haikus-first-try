// Globals ==============================================================
const haiku = [];
let isHaikuValid;
const haikuContainer = document.getElementById("haiku-container");
const line1 = document.getElementById("line-1");
const line2 = document.getElementById("line-2");
const line3 = document.getElementById("line-3");
const currentWordInput = document.getElementById("current-word");
const synonymContainer = document.getElementById("synonyms");

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
}

// Haiku input ===========================================================

currentWordInput.addEventListener("keydown", ev => {
    if (ev.code === "Space" || ev.code === "Enter") { 
        addWord(currentWordInput.value.trim().toLowerCase());
        currentWordInput.value = "";
    } else if (ev.code === "Backspace") {
        deleteLastWord();
    }
});

function dummyResponse(word){
    const newSpan = document.createElement("span");
    newSpan.textContent = word;
    newSpan.classList.add("haiku-word")
    return {
        word: word,
        syllables: 1,
        synonyms: ["foo1", "foo2", "foo3"],
        htmlElement: newSpan
    }
}

function addWord(wordToAdd) {
    const newWordObj = dummyResponse(wordToAdd);
    if (wordToAdd.trim()){
        haiku.push(newWordObj);
        updateHaikuDisplay();
    }
}

function deleteLastWord() {
    if (currentWordInput.value.trim() != "") {
        currentWordInput.value = null;
    } else {
        console.log(haiku.pop());
        updateHaikuDisplay();
    }
}

function updateHaikuDisplay() {
    line1.innerHTML = null;
    line2.innerHTML = null;
    line3.innerHTML = null;
    const [line1IsValid, line2IsValid, line3IsValid] = checkHaiku();
    let runningSyllableCount = 0;
    for (word of haiku) {
        runningSyllableCount += word.syllables
        if (runningSyllableCount < 6) {
            if (line1IsValid) {
                word.htmlElement.classList.add("valid-word");
            } else {
                word.htmlElement.classList.remove("valid-word");
            }
            line1.appendChild(word.htmlElement);
        } else if  (runningSyllableCount < 13) {
            if (line2IsValid) {
                word.htmlElement.classList.add("valid-word");
            } else {
                word.htmlElement.classList.remove("valid-word");
            }
            line2.appendChild(word.htmlElement);
        } else if  (runningSyllableCount < 18) {
            if (line3IsValid) {
                word.htmlElement.classList.add("valid-word");
            } else {
                word.htmlElement.classList.remove("valid-word");
            }
            line3.appendChild(word.htmlElement);
        } else {
            word.htmlElement.classList.remove("valid-word")
            line3.appendChild(word.htmlElement);
        }   
    }
}

function checkHaiku() {
    let isFirstLineValid = false;
    let isSecondLineValid = false;
    let isThirdLineValid = false;
    let runningSyllableCount = 0;
    for (word of haiku)  {
        runningSyllableCount += word.syllables;
        haikuContainer.appendChild(word.htmlElement);
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
