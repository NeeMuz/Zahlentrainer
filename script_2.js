let randomNum;
let currentLevel;
let incorrectAttempts = 0;

function copyToClipboard(char) {
    const el = document.createElement('textarea');
    el.value = char;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert(`Скопировано: ${char}`);
}

const levels = {
    1: { min: 1, max: 100 },
    2: { min: 101, max: 500 },
    3: { min: 501, max: 1000 },
    4: { min: 0, max: 1000 }
};

const germanNumbers = {
    1: "eins", 2: "zwei", 3: "drei", 4: "vier", 5: "fünf", 6: "sechs", 7: "sieben", 8: "acht", 9: "neun", 10: "zehn",
    11: "elf", 12: "zwölf", 13: "dreizehn", 14: "vierzehn", 15: "fünfzehn", 16: "sechzehn", 17: "siebzehn", 18: "achtzehn",
    19: "neunzehn", 20: "zwanzig", 30: "dreißig", 40: "vierzig", 50: "fünfzig", 60: "sechzig", 70: "siebzig", 80: "achtzig",
    90: "neunzig", 100: "hundert", 200: "zweihundert", 300: "dreihundert", 400: "vierhundert", 500: "fünfhundert", 600: "sechshundert",
    700: "siebenhundert", 800: "achthundert", 900: "neunhundert"
};

let currentGermanWord;

function generateNumber(level) {
    const min = levels[level].min;
    const max = levels[level].max;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numberToGerman(num) {
    if (num <= 19) return germanNumbers[num];
    if (num <= 99) {
        const tens = Math.floor(num / 10) * 10;
        const units = num % 10;
        return units ? germanNumbers[units] + "und" + germanNumbers[tens] : germanNumbers[tens];
    }
    if (num <= 999) {
        const hundreds = Math.floor(num / 100) * 100;
        const rest = num % 100;
        return germanNumbers[hundreds] + (rest ? numberToGerman(rest) : "");
    }
    return num.toString();
}

function startGame(level) {
    currentLevel = level;
    randomNum = generateNumber(level);
    currentGermanWord = numberToGerman(randomNum);
    document.getElementById("game").style.display = "block";
    document.getElementById("task").textContent = `Schreiben Sie die Zahl für das Wort. "${currentGermanWord}":`;
    document.getElementById("answer").value = '';
    document.getElementById("feedback").textContent = '';
    document.getElementById("check-button").textContent = 'Überprüfen';
    document.getElementById("check-button").onclick = checkAnswer;
    incorrectAttempts = 0;
    document.getElementById("answer").focus();
}

function checkAnswer(event) {
    if (event) event.preventDefault();
    const answer = document.getElementById("answer").value.trim();
    if (answer === "") {
        document.getElementById("feedback").textContent = "Geben Sie die Antwort ein.";
        document.getElementById("feedback").className = 'error';
        document.getElementById("answer").focus();
        return;
    }

    const correctAnswer = randomNum.toString();
    const feedbackElement = document.getElementById("feedback");
    if (answer === correctAnswer) {
        feedbackElement.textContent = `Die richtige Antwort!`;
        feedbackElement.className = 'correct';
        document.getElementById("check-button").textContent = 'Weiter';
        document.getElementById("check-button").onclick = nextNumber;
        incorrectAttempts = 0;
    } else {
        incorrectAttempts++;
        if (incorrectAttempts >= 3) {
            feedbackElement.textContent = `Falsche Antwort! Richtige Antwort: ${correctAnswer}`;
            feedbackElement.className = 'error';
        } else {
            switch (incorrectAttempts) {
                case 1:
                    feedbackElement.textContent = `Falsche Antwort! Versuchen Sie es erneut.`;
                    break;
                case 2:
                    feedbackElement.textContent = `Immer noch falsche Antwort!`;
                    break;
            }
            feedbackElement.className = 'error';
        }
    }
    document.getElementById("answer").focus();
}

function nextNumber(event) {
    if (event) event.preventDefault();
    randomNum = generateNumber(currentLevel);
    currentGermanWord = numberToGerman(randomNum);
    document.getElementById("task").textContent = `Schreiben Sie die Zahl für das Wort. "${currentGermanWord}":`;
    document.getElementById("answer").value = '';
    document.getElementById("feedback").textContent = '';
    document.getElementById("check-button").textContent = 'Überprüfen';
    document.getElementById("check-button").onclick = checkAnswer;
    incorrectAttempts = 0;
    document.getElementById("answer").focus();
}

function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === "Return") {
        event.preventDefault();
        if (document.getElementById("check-button").textContent === "Fortsetzen") {
            nextNumber();
        } else {
            checkAnswer();
        }
    }
}

function changeTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem('theme', theme);
    document.getElementById('theme-select').value = theme;
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    changeTheme(savedTheme);
    document.getElementById("answer").focus();
}

document.addEventListener('click', function (event) {
    if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'BUTTON') {
        document.getElementById("answer").blur();
    }
});

window.onload = () => {
    loadTheme();
}
