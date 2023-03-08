"use strict";

const wordArea = document.querySelector("#word-area");
const completeWordArea = document.querySelector(".incompleted-word-area");
const incompletedWordArea = document.querySelector(".completed-word-area span");
const timerContent = document.querySelector("#timer-display");
let wordElement;

const wpm = 
{
    wordData: [],
    wordsCompleted: 0,
    Errors: 0,
    cpm: 0,
    count: 5,
    iskeyPressed: false,

    /*Read Data from text file*/
    async readDataIntoArray(){
        this.wordData = await fetch("wordData.txt")
        .then(response => response.text())
        .then(data => {
            return data.match(/\b(\w+)\b/g);
        });
    },
    addWordsToDisplay(text)
    {
        const spanElement = document.createElement("span");
        completeWordArea.appendChild(spanElement);
        spanElement.textContent = text;
    },
    addIncorrectWordToDisplay(text)
    {
        const strikeElement = document.createElement("span");
        incompletedWordArea.appendChild(strikeElement).classList.add("incorrect-letter");
        strikeElement.textContent = text;
    },
    updateTimer()
    {
        const timer = function()
        {
            if(wpm.count != 0 && wpm.iskeyPressed)
            {
                wpm.count--;
                timerContent.textContent = `Timer: ${String(wpm.count)} Sec`;
            }
        }

        setInterval(timer, 1000);
    },
    displayModal()
    {
        const modal = document.querySelector(".completed-test-modal");
        const closeModalBtn = document.querySelector(".close-modal");
        const wpmContent = document.querySelector(".wpm");
        const errContent = document.querySelector(".err");
        const cpmContent = document.querySelector(".cpm");

        function visible()
        {
            if(wpm.count === 0)
            {
                modal.classList.add("visible-modal");

                wpmContent.textContent = wpm.wordsCompleted;
                errContent.textContent = wpm.Errors;
                cpmContent.textContent = wpm.cpm;

                closeModalBtn.addEventListener("click", function()
                {

                    wpm.iskeyPressed = false;
                    modal.classList.remove("visible-modal");

                    wpm.count = 60;
                    timerContent.textContent = `Timer: ${String(wpm.count)} Sec`;

                    // Clear text area
                    incompletedWordArea.textContent = "";
                    document.querySelector(".incompleted-word-area span").remove();

                    wpm.updateWordDisplay();
                    
                });

                clearInterval(checkModal);  
            }
        }

        var checkModal = setInterval(visible, 1);
    },
    keyboardInputs(index)
    {
        document.addEventListener("keypress", (event) =>
        {   
            this.iskeyPressed = true;

            // Stops keyboard inputs if timer reaches 0
            if(this.count === 0) return;

            if(event.key === wordElement[index].textContent[0])
            {   
                // Add letter to completed word area
                incompletedWordArea.textContent += wordElement[index].textContent[0];
                wpm.cpm++;

                // Removes first letter from selected word
                let updateWordEle = wordElement[index].textContent.slice(1);
                wordElement[index].textContent = updateWordEle;
                
                if(wordElement[index].textContent.length === 0)
                {
                    index++;
                    this.wordsCompleted++;
                }
            }
            else if(event.key != wordElement[index].textContent[0] && event.key != " ")
            {
                //this.addIncorrectWordToDisplay(event.key);
                this.Errors++;
            }
        });
    },
    shuffle()
    {
        this.wordData = this.wordData.sort((a,b) => 0.5 - Math.random());
    },
    updateWordDisplay()
    {   
        let index = 0;
        this.readDataIntoArray();
        this.displayModal();
        this.updateTimer();

        function display()
        {
            wpm.shuffle();
            wpm.wordData.forEach((word, index) => 
            {
                wpm.addWordsToDisplay(`${word} `);
                //Add classes to span elements
                wordElement = document.querySelectorAll(".incompleted-word-area span");
                wordElement[index].classList.add("word-content");
            });
        }
        // Required while data is being stored in array
        setTimeout(display, 5);

        this.keyboardInputs(index);
    }
}

wpm.updateWordDisplay();

