"use strict";
const wordArea = document.querySelector("#word-area");

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
        this.readDataIntoArray();
        function display()
        {
            wpm.wordData.forEach(word => 
            {
                const spanElement = document.createElement("span");
                const wordContent = document.createTextNode(`${word} `);
                spanElement.appendChild(wordContent);
                wordArea.appendChild(spanElement);
            });
        }
        // Required while data is being stored in array
        setTimeout(display, 5);
    }
}

wpm.updateWordDisplay();

document.addEventListener("keypress", (event) =>
{
    if(event.key === wpm.wordData[0][0])
    {
        console.log("Works");
    }
    console.log(event.key);
});

