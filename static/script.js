const translateBtn = document.getElementById("translateBtn");
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const swapBtn = document.getElementById("swapBtn");

// Translate Text
translateBtn.addEventListener("click", async () => {

    if(inputText.value.trim() === ""){
        alert("Please enter some text.");
        return;
    }

    const response = await fetch("/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: inputText.value,
            source: sourceLang.value,
            target: targetLang.value
        })
    });

    const data = await response.json();

    if(data.error){
        alert(data.error);
    }else{
        outputText.value = data.translated_text;
    }

});

// Copy Translation
function copyText(){

    if(outputText.value===""){
        alert("Nothing to copy!");
        return;
    }

    navigator.clipboard.writeText(outputText.value);
    alert("Copied Successfully!");
}

// Text to Speech
function speakText(){

    if(outputText.value===""){
        alert("Nothing to speak!");
        return;
    }

    let speech = new SpeechSynthesisUtterance(outputText.value);
    speech.lang = targetLang.value;
    window.speechSynthesis.speak(speech);

}

// Voice Input
function startVoice(){

    if(!('webkitSpeechRecognition' in window)){
        alert("Speech Recognition not supported.");
        return;
    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = sourceLang.value === "auto" ? "en-US" : sourceLang.value;

    recognition.onresult = function(event){
        inputText.value = event.results[0][0].transcript;
    }

    recognition.start();

}

// Download Translation
function downloadText(){

    if(outputText.value===""){
        alert("Nothing to download.");
        return;
    }

    const blob = new Blob([outputText.value], {type:"text/plain"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "translation.txt";

    link.click();

}

// Clear Text
function clearText(){

    inputText.value = "";
    outputText.value = "";

}

// Swap Languages
swapBtn.addEventListener("click", ()=>{

    let temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;

    let txt = inputText.value;
    inputText.value = outputText.value;
    outputText.value = txt;

});