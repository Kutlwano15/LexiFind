const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
synonyms = wrapper.querySelector(".synonyms .list"),
infoText = wrapper.querySelector(".info-text"),
volumeIcon = wrapper.querySelector(".word i"),
exitIcon = wrapper.querySelector(".search span");
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
            let tag = `<span onclick= "search('${synonymsList[i]}')">${synonymsList[i]}</span>`;
            synonyms.insertAdjacentHTML("beforeend", tag);
        }
    }
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
        audio = new Audio(result[0].phonetics[0].audio);

        setSynonyms(definitions.synonyms);
    }
}

function search(word){
    searchInput.value = word;
    fetchApi(word);
    wrapper.classList.remove("active");
}

function fetchApi(word) {
    wrapper.classList.remove("active");
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

volumeIcon.addEventListener("click", ()=>{
    audio.play();
  });

  exitIcon.addEventListener("click", ()=>{
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
  })