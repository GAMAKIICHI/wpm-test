"use strict";
import {handleButtonGroupClick} from "./difficultySelector.js";
import {loadWords, displayWords, updateCurrentWord} from "./loadwords.js";
import {Timer, getCSRFTokenFromForm} from "./util.js";
import 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';

let myTimer = new Timer(60);
let accuracy = 0;
let wordsPerMinute = 0;
let totalWords = 0;
let wpmErrors = 0;
let currentWord = 0;
let wordsDisplayed = 0;
let words = null;
let difficulty = "easy";

const timerEvent = new Event("timer");

window.addEventListener("load", async() => {
    const difficultyButtons = document.querySelectorAll(".difficulty-selector");
    const modeButtons = document.querySelectorAll(".mode-selector");
    const CSRFToken = getCSRFTokenFromForm("difficulty-form");
    const inputBox = document.getElementById("input-box");
    const accuracy = document.getElementById("accuracy");
    const wpm = document.getElementById("wpm");
    const errors = document.getElementById("errors");
    const modalElement = document.getElementById("statsModal");
    const statsModal = new bootstrap.Modal(modalElement);
    const timerDisplay = document.getElementById("timer");

    await updateWords(difficulty, CSRFToken);

    updateDisplayedWords();

    for(const button of difficultyButtons){
        button.addEventListener("click", async() => {
            handleButtonGroupClick(difficultyButtons, button);
            difficulty = button.value.toLowerCase();
            await updateWords(difficulty, CSRFToken);
            updateDisplayedWords();
        });
    }

    for(const button of modeButtons){
        button.addEventListener("click", () => {
            handleButtonGroupClick(modeButtons, button);
            myTimer.setTime(button.dataset.mode * 60);
            timerDisplay.textContent = `${myTimer.getTime()} s`;
        });
    }

    timerDisplay.addEventListener("timer", () => {

        myTimer.update(timerDisplay);

        //check if timer finishes
        const finished = setInterval(async () => {

            if(myTimer.countdown === 0){
                setTimeout(async() => {
                    statsModal.show();
                    updateCompletedStats();
                    reset(timerDisplay, accuracy, wpm, errors, inputBox);
                    await updateWords(difficulty, CSRFToken);
                    updateDisplayedWords();
                    clearInterval(finished);
                });
            }

        }, 1000);
    });

    inputBox.addEventListener("input", () => {

        const lastCharacter = inputBox.value.length-1;

        //starts timer
        if(!myTimer.isTime){
            myTimer.start();
            timerDisplay.dispatchEvent(timerEvent);
        }

        //checks if space has been pressed to go to next word
        if(inputBox.value.charCodeAt(lastCharacter) === 32){
            //compares the current typed(input value needs to be sliced not to include space) with with current word.
            const isMatching  = inputBox.value.slice(0, -1) === words[currentWord];

            if(!isMatching){
                wpmErrors++;
            }

            calcStats();
            updateStats(accuracy, wpm, errors);

            updateCurrentWord(currentWord++, isMatching);
            inputBox.value = "";
        }

        //removes finished words and displays new words
        if(currentWord > wordsDisplayed-1){
            words = words.slice(wordsDisplayed);
            updateDisplayedWords();
            currentWord = 0;
        }
    });

    window.addEventListener("resize", () => {
       updateDisplayedWords();
    });
    
});

function updateDisplayedWords(){
    wordsDisplayed = displayWords(words, "words-container");
}

async function updateWords(difficulty, CSRFToken){
    words = await loadWords("/wpm/", CSRFToken, difficulty);
}

function calcStats(){
    totalWords++;
    wordsPerMinute = Math.floor(totalWords / (myTimer.getTime() / 60));
    accuracy = Math.floor(((totalWords-wpmErrors) / totalWords) * 100);
}

function updateStats(accuracyEle, wpmEle, errorsEle){
    accuracyEle.textContent = `${accuracy} %`;
    wpmEle.textContent = `${wordsPerMinute}`;
    errorsEle.textContent = `${wpmErrors}`;
}

function updateCompletedStats()
{
    const accuracyEle = document.getElementById("stats-accuracy");
    const wpmEle = document.getElementById("stats-wpm");
    const errorsEle = document.getElementById("stats-errors");
    const levelsEle = document.getElementById("stats-level");

    updateStats(accuracyEle, wpmEle, errorsEle);
    levelsEle.textContent = getLevel(wordsPerMinute);
}

function getLevel(wpm){
    if(wpm <= 40){
        return String.fromCodePoint(0x1F422); //turtle
    }
    else if(wpm <= 60){
        return String.fromCodePoint(0x1F401); //mouse
    }
    else if(wpm <= 80){
        return String.fromCodePoint(0x1F407); //rabbit
    }
    else if(wpm > 80){
        return String.fromCodePoint(0x1F406); //lepard
    }
}

async function reset(timerEle, accuracyEle, wpmEle, errorsEle, inputBox){
    accuracy = 0;
    wordsPerMinute = 0;
    totalWords = 0;
    wpmErrors = 0;
    currentWord = 0;
    wordsDisplayed = 0;
    myTimer.reset();

    timerEle.textContent = `${myTimer.time} s`;
    accuracyEle.textContent = "--";
    wpmEle.textContent = "--";
    errorsEle.textContent = "--";
    inputBox.value = "";
    inputBox.blur();
}