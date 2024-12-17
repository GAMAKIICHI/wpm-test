"use strict";
import { removeAllChildNodes, shuffle } from "./util.js";

const currentWordStyles = ["text-dark", "text-decoration-underline"];
const nextWordStyles = "text-dark-emphasis";
const wrongWordStyles = ["text-danger", "text-decoration-line-through"];
const correctWord = "text-success";

export async function loadWords(url, token, mode){
    try{
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": token,
            },
            body: JSON.stringify({mode: mode}),
        });
    
        if(!response.ok){
            throw new Error(`Request failed with status ${response.status}`);
        }
    
        const data = await response.json();
    
        /*converts from python list to js array */
        const wordList = data.words.replace(/'/g, '"');
        const words = JSON.parse(wordList);

        shuffle(words);

        return words;
    } catch(error){
        console.error(`Error: ${error.message}`);
    }
}

/*this function appends an array of words into a container using bootstrap styles. If any elements are overflowing they will not render*/
export function displayWords(words, containerId){
    try{
        if(!Array.isArray(words)){
            throw new Error("Words must be in a array.");
        }

        const wordsContainer = document.getElementById(containerId);
        const containerWidth = getElementContentSize(wordsContainer);
        var totalWordsWidth = 0;
        var numberOfWordsDisplayed = 0;

        removeAllChildNodes(wordsContainer);

        for(let i = 0; i < words.length; i++){

            const wordElement = document.createElement("span");
            const elementSpacing = "ms-2 d-inline-block";

            if(i === 0){
                wordElement.className = `${elementSpacing} ${currentWordStyles.join(" ")}`;
            }
            else{
                wordElement.className = `${elementSpacing} ${nextWordStyles}`;
            }

            wordElement.dataset.num = i;
            wordElement.textContent = words[i];
            wordsContainer.appendChild(wordElement);

            totalWordsWidth += getElementTrueSize(wordElement).width;

            if(totalWordsWidth > containerWidth.width){
                wordElement.remove();
                return numberOfWordsDisplayed;
            }

            numberOfWordsDisplayed++;

        }
    } catch(error){
        console.error(`Error: ${error.message}`);
    }
}

/*This function returns the size of element including its margin*/
function getElementTrueSize(element){
    try{
        const styles = getComputedStyle(element);

        const marginTop = parseFloat(styles.marginTop);
        const marginBottom = parseFloat(styles.marginBottom);
        const marginRight = parseFloat(styles.marginRight);
        const marginLeft = parseFloat(styles.marginLeft);

        return {
            width: element.offsetWidth + marginRight + marginLeft,
            height: element.offsetHeight + marginTop + marginBottom
        }

    } catch(error){
        console.error(`Error: ${error.message}`);
        return 0;
    }
}

/*this function returns an elements content width and height(exluding padding). Returns 0 if invalid element*/
function getElementContentSize(element){
    try{
        const styles = getComputedStyle(element);

        const paddingTop = parseFloat(styles.paddingTop);
        const paddingBottom = parseFloat(styles.paddingBottom);
        const paddingRight = parseFloat(styles.paddingRight);
        const paddingLeft = parseFloat(styles.paddingLeft);

        return {
            width: element.clientWidth - paddingRight - paddingLeft,
            height: element.clientHeight - paddingTop - paddingBottom
        }

    } catch(error){
        console.error(`Error: ${error.message}`);
        return 0;
    }
}

/*this function removes all current word styles from completed word and updates the next word to have the current word styles*/
export function updateCurrentWord(wordIndex, isMatching){
    let currentWord = document.querySelector(`[data-num='${wordIndex}']`);
    let nextWord = document.querySelector(`[data-num='${wordIndex+1}']`);
    
    currentWord.classList.remove(...currentWordStyles);

    if(isMatching){
        currentWord.classList.add(correctWord);
    }
    else{
        currentWord.classList.add(...wrongWordStyles);
    }

    if(nextWord != null){
        nextWord.classList.remove(nextWordStyles);
        nextWord.classList.add(...currentWordStyles);
    }
}