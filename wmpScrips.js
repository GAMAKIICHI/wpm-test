"use strict";

const wordArea = document.querySelector("#word-area");
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
    updateWordDisplay()
    {   
        this.readDataIntoArray();
        let index = 0;
        
        function display()
        {
            wpm.wordData.forEach((word, index) => 
            {
                const spanElement = document.createElement("span");
                const wordContent = document.createTextNode(`${word} `);
                spanElement.appendChild(wordContent);
                wordArea.appendChild(spanElement);

                //Add classes to span elements
                wordElement = document.querySelectorAll("#word-area span");
                wordElement[index].classList.add("word-content");
            });
        }
        // Required while data is being stored in array
        setTimeout(display, 5);

        document.addEventListener("keypress", (event) =>
        {   
            if(event.key === wordElement[index].textContent[0])
            {   
                // Removes first letter from selected word
                let updateWordEle = wordElement[index].textContent.slice(1);
                wordElement[index].textContent = updateWordEle;

                if(wordElement[index].textContent.length === 0)
                {
                    index++;
                    this.wordsCompleted++;
                }
            }
            console.log(event.key);
        });
    }
}

wpm.updateWordDisplay();

