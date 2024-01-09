const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
synonyms = wrapper.querySelector(".synonyms .list"),
infoText = wrapper.querySelector(".info-text"),
volumeIcon = wrapper.querySelector(".fa-volume-up")
let audio;


function setInfoText(message, color = "#000") {
    infoText.style.color = color;
    infoText.innerHTML = message;
}

function setSynonyms(synonymsList) {
    if (!synonymsList || synonymsList.length === 0) {
        synonyms.parentElement.style.display = "none";
    } else {
        synonyms.parentElement.style.display = "block";
        synonyms.innerHTML = "";
        for (let i = 0; i < Math.min(synonymsList.length, 5); i++) {
            let tag = `<span>${synonymsList[i]}</span>`;
            synonyms.insertAdjacentHTML("beforeend", tag);
        }
    }
}

function playAudio(audioUrl) {
    audio = new Audio("https:" + audioUrl);
    audio.play();
}

function handleApiResponse(result, word) {
    if (result.title) {
        setInfoText(`Cannot find the meaning of <span>${word}</span>. Please, try to search for another word.`);
    } else {
        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0],
            phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        // playAudio(result[0].phonetics[0].audio);
        setSynonyms(definitions.synonyms);
        volumeIcon.addEventListener("click", () => {
            playAudio(result[0].phonetics[0].audio);
          });
    }
}

function fetchApi(word) {
    setInfoText(`Searching the meaning of <span>${word}</span>`);
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then(res => res.json())
        .then(result => handleApiResponse(result, word))
        .catch(error => {
            console.error("Error fetching data:", error);
            setInfoText("An error occurred while fetching the data. Please try again later.", "red");
        });
}

searchInput.addEventListener("keyup", e =>{
    if(e.key ==="Enter" && e.target.value){
        fetchApi(e.target.value);
    }
});