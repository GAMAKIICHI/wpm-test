"use strict";

/*This function updates a button color using bootstraps default colors
colors available: primary, success, danger, warning, info, light, dark */
export function setButtonColor(btn, btnColor){
    try{
        const possibleColors = ["primary", "success", "danger", "warning", "info", "light", "dark"];

        if(!possibleColors.includes(btnColor)){
            throw Error("Invalid Color. Must be included in available colors.");
        }

        /*looks if button already has a color and removes it*/
        for(const color of possibleColors){
            if(btn.classList.contains(`btn-${color}`)){
                btn.classList.remove(`btn-${color}`);
                btn.classList.remove(`border-${color}-subtle`);
            }
        }

        btn.classList.add(`btn-${btnColor}`);
        btn.classList.add(`border-${btnColor}-subtle`);
        
    } catch(error){
        console.error(error);
    }
}

/*This function changes a group of buttons colors depending if clicked on*/
export function handleButtonGroupClick(buttons, clickedButton){
    for(const button of buttons){
        if(button === clickedButton){
            setButtonColor(button, "success");
        }
        else{
            setButtonColor(button, "dark");
        }
    }
}
