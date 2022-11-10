const haiku = [];
const haikuRepo = {
    getHaiku: function () {
        return haiku;
    },
    addWord: function (wordObj) {
        haiku.push(wordObj);
    },
    eraseHaiku:function () {
        haiku = [];
    },
    substituteSynonym: function (wordObj, index) {
        haiku[index] = wordObj;
    },
    deleteLastWord: function () {
        haiku.pop();
    },
    checkHaiku: function () {
        let isFirstLineValid = false;
        let isSecondLineValid = false;
        let isThirdLineValid = false;
        let runningSyllableCount = 0;
        for (let word of haiku) {
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
        // if (isFirstLineValid && isSecondLineValid && isThirdLineValid) {
        //     isHaikuValid = true;
        // } else {
        //     isHaikuValid = false;
        // }
        return [isFirstLineValid, isSecondLineValid, isThirdLineValid];
    }
}
export {haikuRepo};

