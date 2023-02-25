"use strict";

const wordArea = document.querySelector("#word-area");
const completeWordArea = document.querySelector(".incompleted-word-area");
const incompletedWordArea = document.querySelector(".completed-word-area");
let wordElement;

const wpm = 
{
    wordData: [],
    wordsCompleted: 0,

    /*Read Data from text file*/
    async readDataIntoArray(){
        this.wordData = await fetch("wordData.txt")
        .then(response => response.text())
        .then(data => {
            return data.match(/\b(\w+)\b/g);
        });
    },
    addWordsToDisplay(text,status)
    {
        const spanElement = document.createElement("span");
        (status === true ? completeWordArea : incompletedWordArea).appendChild(spanElement);
        spanElement.textContent = text;

        
    },
    checkOverflow()
    {
        console.log(wordArea.offsetWidth / 2);
        console.log("s " + incompletedWordArea.offsetWidth);
    },
    updateWordDisplay()
    {   
        this.readDataIntoArray();
        let index = 0;
        
        function display()
        {
            wpm.wordData.forEach((word, index) => 
            {
                wpm.addWordsToDisplay(`${word} `, true);
                //Add classes to span elements
                wordElement = document.querySelectorAll(".incompleted-word-area span");
                wordElement[index].classList.add("word-content");
            });
        }
        // Required while data is being stored in array
        setTimeout(display, 5);

        document.addEventListener("keypress", (event) =>
        {   
            wpm.checkOverflow();

            if(event.key === wordElement[index].textContent[0])
            {   
                // Removes first letter from selected word
                let updateWordEle = wordElement[index].textContent.slice(1);
                wordElement[index].textContent = updateWordEle;
                
                // Add letter to completed word area
                wpm.addWordsToDisplay(event.key, false);

                if(wordElement[index].textContent.length === 0)
                {
                    index++;
                    this.wordsCompleted++;
                }
            }
        });
    }
}

wpm.updateWordDisplay();

