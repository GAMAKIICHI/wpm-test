"use strict";

const wordArea = document.querySelector(".test");
const words = ["Apple", "Dog", "Cat", "Orange", "House", "Car", "Bottle", "Frog"];

wordArea.textContent = "";

words.forEach(word => 
{
    wordArea.textContent += `${word} `;
});