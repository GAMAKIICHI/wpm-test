"use strict";

export function removeAllChildNodes(parent){
    while(parent.firstChild){
        parent.removeChild(parent.firstChild);
    }
}

export function shuffle(array){
    for(let i = array.length - 1; i >= 0; i--){
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
}

export function getCSRFTokenFromForm(formId){
    try{
        const form = document.getElementById(formId);
        const CSRFToken = form.querySelector("input[name='csrfmiddlewaretoken']");

        return CSRFToken.value;
    }
    catch(error){
        console.error(error);
    }
}

export class Timer{
    constructor(time){
        this.time = time;
        this.countdown = this.time;
        this.isTime = false;
    }

    setTime(updatedTime){
        try{

            if(typeof updatedTime !== "number"){
                throw new TypeError("Error: Must be type 'number'")
            }
            this.time = updatedTime;
            this.countdown = this.time;
        }catch(error){
            console.error(error)
        }
    }

    getTime(){
        return this.time;
    }

    start(){
        this.isTime = true;
    }

    update(element){
        
        if(!this.isTime)
            return;

        let timer;
        timer = setInterval(() =>{
            element.textContent = `${--this.countdown} s`;

            if(this.countdown === 0){
                clearInterval(timer);
                this.stop();
            }
        }, 1000);
    }

    stop(){
        this.isTime = false;
    }

    reset(){
        this.isTime = false;
        this.countdown = this.time;
    }
}