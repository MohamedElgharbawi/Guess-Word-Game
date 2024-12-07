let numebrOfTries = 5;
let currentTry = 1;
let fruits = ["mango", "orange", "quince" ,"kiwi", "papaya", "apple", "banana", "cherry", "grape", "lemon"];
let theWord = fruits[Math.floor(Math.random() * fruits.length)];
let numberOfLetters = theWord.length;
let buttons = document.querySelector(".buttons");
let checkBtn = document.querySelector(".check");
let hintBtn = document.querySelector(".hint");
let arrOfWord = theWord.split("");
let arr = [];

window.onload = () => {
    buttons.style.width = `${document.querySelector(".inputs").offsetWidth}px`;
    window.onresize =  () => buttons.style.width = `${document.querySelector(".inputs").offsetWidth}px`;
}
function resetValues() {
    for (let i = 97; i <= 122; i++)
        arr[i] = 0;
    for (let i = 0; i < numberOfLetters; i++) 
        arr[arrOfWord[i].charCodeAt()]++;
}
resetValues();
function generateInputs() {
    for (let i = 0; i < numebrOfTries; i++) { 
        let mainDiv = document.createElement("div");
        mainDiv.classList.add("inputs");
        mainDiv.id = `try-${i + 1}`;
        let span = document.createElement("span");
        span.innerHTML = `try-${i + 1}`;
        mainDiv.appendChild(span);
        for (let j = 0; j < numberOfLetters; j++) {
            let input = document.createElement("input");
            input.maxLength = 1;
            input.classList.add(`try-${i + 1}_letter-${j + 1}`);
            mainDiv.appendChild(input);
        }
        buttons.before(mainDiv);
        if (i) {
            mainDiv.classList.add("disabled");
            for (let j = 1; j < mainDiv.children.length; j++) 
                mainDiv.children[j].disabled = true; 
        } else 
            mainDiv.children[1].focus();
    }
}
generateInputs();
function manageWord() {
    let currentInputs = document.getElementById(`try-${currentTry}`).querySelectorAll("input");
    let flag = true;
    for (let i = 0; i < currentInputs.length; i++) {
        if (currentInputs[i].value.toLowerCase() === arrOfWord[i]) {
            currentInputs[i].classList.add("in-place");
            arr[currentInputs[i].value.toLowerCase().charCodeAt()]--;
        } else {
            currentInputs[i].classList.add("not-exists");
            currentInputs[i].classList.add("black");
            flag = false;
        }
    } 
    for (let i = 0; i < currentInputs.length; i++) {
        if (currentInputs[i].classList.contains("black") && arr[currentInputs[i].value.toLowerCase().charCodeAt()]) {
            arr[currentInputs[i].value.toLowerCase().charCodeAt()]--;
            currentInputs[i].classList.remove("not-exists");
            currentInputs[i].classList.add("not-in-place");
        }
        currentInputs[i].classList.remove("black");
    }
    if(flag) {
        disabledCheckBtn();
        disabledHintBtn();
        disabledInputs(currentTry);
        let div = document.createElement("div");
        div.innerHTML = `Congratulations You Win`;
        div.style.cssText = `font-size: 25px;text-align: center;margin-top: 20px;padding: 20px;background: white;font-weight: bold;color: var(--fifth-color)`;
        buttons.after(div);
    } else {
        resetValues();
        currentTry++;
        if (currentTry <= numebrOfTries) {
            for (let i = 0; i < numebrOfTries; i++) {
                document.getElementById(`try-${i + 1}`).classList.add("disabled");
            }
            document.getElementById(`try-${currentTry}`).classList.remove("disabled");
            document.querySelectorAll("input").forEach(input => input.disabled = true);
            document.getElementById(`try-${currentTry}`).querySelectorAll("input").forEach(input => input.disabled = false);
            document.getElementById(`try-${currentTry}`).querySelectorAll("input")[0].focus();
        } else {
            disabledCheckBtn();
            disabledHintBtn();
            disabledInputs(currentTry - 1);
            let div = document.createElement("div");
            div.innerHTML = `You Lose The Word Is <span style="color: var(--third-color)">${theWord.toUpperCase()}</span>`;
            div.style.cssText = `font-size: 25px;text-align: center;margin-top: 20px;padding: 20px;background: white;font-weight: bold`;
            buttons.after(div);
        }
    }
}
function disabledInputs(index) {
    document.getElementById(`try-${index}`).querySelectorAll("input").forEach(input => input.disabled = true);
    document.getElementById(`try-${index}`).classList.add("disabled");
}
function disabledHintBtn() {
    hintBtn.style.pointerEvents = "none";
    hintBtn.style.opacity = ".5";
}
function disabledCheckBtn() {
    checkBtn.style.pointerEvents = "none";
    checkBtn.style.opacity = ".5";
}
checkBtn.onclick = manageWord;
let inputs = document.querySelectorAll("input");
hintBtn.onclick =  () => {
    let filter = Array.from(document.getElementById(`try-${currentTry}`).querySelectorAll("input")).filter(input => input.value === "");
    if (filter.length) {
        let index = Math.floor(Math.random() * filter.length);
        let str = "";
        for (let j = filter[index].className.length - 1; !isNaN(parseInt(filter[index].className[j])); j--)
            str += filter[index].className[j];
        filter[index].value = theWord[Number(str.split("").reverse().join('')) - 1].toUpperCase();
        filter[index].classList.add("active");
        hintBtn.querySelector("span").innerHTML--;
        if (!Number(hintBtn.querySelector("span").innerHTML))
            disabledHintBtn();
    }
}
inputs.forEach((input,index) => input.oninput = () => {
    if (input.value !== " " && input.value !== "") {
        input.value = input.value.toUpperCase();
        input.classList.add("active");
        if (index + 1 < inputs.length)
            inputs[index + 1].focus();
    }
    else 
        input.value = "";
});
inputs.forEach((input, index) => input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && index < inputs.length - 1) 
        inputs[index + 1].focus();
    else if(e.key === "ArrowLeft" && index) 
        inputs[index - 1].focus();
    else if(e.key === "Enter") 
        manageWord();
    else if (e.key === "Backspace" && index && !input.value) {
        inputs[index - 1].focus();
        inputs[index - 1].classList.remove("active");
    }
    if (inputs[index].value === "" || e.key === "Backspace") 
        input.classList.remove("active");
}));