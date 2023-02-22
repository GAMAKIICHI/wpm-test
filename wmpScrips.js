"use strict";

const wordArea = document.querySelector(".test");

const wpm = 
{
    wordData: [],

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
        wordArea.textContent = "";
        this.readDataIntoArray();
        function display()
        {
            wpm.wordData.forEach(word => 
            {
                wordArea.textContent += `${word} `;
            });
        }
        // Required while data is being stored in array
        setTimeout(display, 5);
    }
}

wpm.updateWordDisplay();

