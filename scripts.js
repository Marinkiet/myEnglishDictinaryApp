const wrapper =  document.querySelector(".wrapper");        //get elements
searchInput = wrapper.querySelector("input");               
infoText = wrapper.querySelector(".info-text");             
thesynonyms = wrapper.querySelector(".synonyms .list");     
volume = wrapper.querySelector(".word i");                  
removeIcon = wrapper.querySelector(".search span");         

function fetchApi(word){                                                        //fetch API function
    wrapper.classList.remove("active");                                         //keep data section hidden
    infoText.style.color="black";                                               //the defualt message black before searching
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;     //default message concatinating the word searched by user
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;        //get api in variable url
    fetch(url)
    .then(res=>res.json())                                                      //fetch data, then respond in json format 
    .then(result=>data(result,word))                                            //then take the result as data
    .catch(alert.error);                                                        //catch any errors and alert it
}

function data(result,word){                                                                     //pass in the results and word 
    if(result.title){                                                                           //if title exists change the defualt info to this
        infoText.innerHTML=`Can't find the meaning of <span>"${word}"</span>.                   
        Please try searching for another word, or check if the word id spelt correctly.`;       
    }else{                                                                                      
        //console.log(result);                                                                    
        wrapper.classList.add("active");                                                        //hide the defult info
    }

    let definition = result[0].meanings[0].definitions[0];                                       //get the definition object
    let synonym = result[0].meanings[0];                                                         //get the sysnonym object 
    let phonetic = `${result[0].meanings[0].partOfSpeech}/${result[0].phonetics[0].text}/`;      //get the phonetic and display with part of speech

    document.querySelector(".word p").innerText = result[0].word;                                //change/update the word
    document.querySelector(".word span").innerText = phonetic;                                   //change/update the phonetic
    document.querySelector(".meaning span").innerHTML = definition.definition;                   //chamge/update the definition
    document.querySelector(".example span").innerHTML = definition.example;                      //change/update the example

    audio = new Audio(result[0].phonetics[0].audio);                                             //create/get an audio object(url)
    //console.log(audio);
    if (synonym.synonyms[0]==undefined) {                                                        //chech if synonym from api exists then...
        thesynonyms.parentElement.style.display="none";                                          //change the style of the div it exists in to hidden            
    }else{
        for (let i = 0; i < 5; i++) {
            thesynonyms.parentElement.style.display="block";                                     //else display the synonym div with the info
            thesynonyms.innerHTML="";                                                            //reset/default to empty string
            let tag = `<span onclick=search('${synonym.synonyms[i]}')>${synonym.synonyms[i]},</span>`;        //set the synonym tag to the sysnonyms found < 5 and call the search function on selected synonym
            thesynonyms.insertAdjacentHTML("beforeend",tag);                                     //add the synonyms tag one after the other from loop 
    
        }
    }
    
}
function search(word){                  //search the selected synonym
    searchInput.value=word;             //set the input text to the word/synonym selected
    fetchApi(word);                     //call the fetchApi on the word/synonym
    wrapper.classList.remove("active"); //display the details about the selected  word/synonym

}

searchInput.addEventListener("keyup",e=>{   //on click of <enter>
    if(e.key=="Enter" && e.target.value){   //check if 'Enter' key is clicked and a word is entred/not empty
    fetchApi(e.target.value);               //call the fetchApi function on the word/value entered
    }
});
volume.addEventListener("click",()=>{       //on click of volume icon
    audio.play();                           //play the sound called from the audio object
});
removeIcon.addEventListener("click",()=>{   //on click of 'x' icon in the text input of the searched word...
    searchInput.value = "";                 //clear the input field
    searchInput.focus();                    //keep cursor on the input field
    wrapper.classList.remove("active");     //remove the detail div which contains the defintion of the word
    infoText.style.color="gray";           //change/update the default propting user to enter word to search message to gray color...
    infoText.innerHTML = 'Type a word and click enter to get the meaning, example, pronounciation, and synonyms of the word.'; //defualt message
});