// Globals ==============================================================
const haiku = [];
let isHaikuValid;
const haikuContainer = document.getElementById("haiku-container");
const line1 = document.getElementById("line-1");
const line2 = document.getElementById("line-2");
const line3 = document.getElementById("line-3");
const currentWordInput = document.getElementById("current-word");
const synonymContainer = document.getElementById("synonym-container");

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
    while (haiku.length) {haiku.pop();}

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

function lookUp(word) {
    const url = `http://localhost:${PORT}/${word}`;
    const result = {};
    const newSpan = document.createElement("span");
    newSpan.textContent = word;
    newSpan.classList.add("haiku-word")

    fetch(url).then(response => response.json())
	.then(response => {
        console.log(response)
    })
	.catch(err => console.error(err));
    
    return {
        word: word,
        syllables: 1,
        synonyms: ["foo1", "foo2", "foo3"],
        htmlElement: newSpan
    }
}

function addWord(wordToAdd) {
    if (wordToAdd.trim()) {
        const newWordObj = dummyResponse(wordToAdd);
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

function checkHaiku() {
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

function showSynonyms(arrOfSynonyms, i) {
    synonymContainer.innerHTML = null;
    arrOfSynonyms.forEach(synonym => {
        const btn = document.createElement("btn");
        btn.textContent = synonym;
        btn.classList.add("synonym-button");
        console.log(i);

        btn.addEventListener("click", () => substituteSynonym(synonym, i));
        synonymContainer.appendChild(btn);
    });
    synonymContainer.classList.remove("display-none");
}

function substituteSynonym(synonym, i) {
    const newWordObj = dummyResponse(synonym);
    newWordObj.htmlElement.addEventListener("click", () => showSynonyms(newWordObj.synonyms, i));
    haiku[i] = newWordObj;
    updateHaikuDisplay();
    synonymContainer.classList.add("display-none");
    synonymContainer.innerHTML = null;
}