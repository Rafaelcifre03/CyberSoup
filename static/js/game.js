// triggered on page load and after every attempt.
heartfn = () => {

    let health = document.getElementById("health");
    let heart = document.createElement("i");
    heart.classList = "bi bi-heart-fill";

    let xhr = new XMLHttpRequest();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const chlid = urlParams.get('id')

    xhr.open("GET", /* window.location.hostname + window.location.pathname + */ "?action=getHealth&id=" + chlid);

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {

            respuesta = JSON.parse(xhr.responseText);
            health.innerHTML = "";

            if (respuesta.status == "not logged in") {
                health.textContent = "Please log in to play.";
            } else {
                for (let index = 0; index < respuesta.health; index++) {
                    health.appendChild(heart.cloneNode(true));
                    console.log("heart");
                }
            }
        }
    }

    xhr.send();

}

// show the keyboard
const Keyboard = window.SimpleKeyboard.default;

let keyboard = new Keyboard({
    /* onChange: input => onChange(input), */
    onKeyPress: button => onKeyPress(button),
    mergeDisplay: true,
    layoutName: "default",
    layout: {
        default: [
            "Q W E R T Y U I O P {backspace}",
            "A S D F G H J K L {ent}",
            "Z X C V B N M"
        ]
    },
    display: {
        "{numbers}": "123",
        "{ent}": "enter",
        "{escape}": "esc ⎋",
        "{tab}": "tab ⇥",
        "{backspace}": "⌫",
        "{capslock}": "caps lock ⇪",
        "{shift}": "⇧",
        "{controlleft}": "ctrl ⌃",
        "{controlright}": "ctrl ⌃",
        "{altleft}": "alt ⌥",
        "{altright}": "alt ⌥",
        "{metaleft}": "cmd ⌘",
        "{metaright}": "cmd ⌘",
        "{abc}": "ABC"
    }
});

/* function onChange(input) {
    document.querySelector(".input").value = input;
    console.log("Input changed", input);
} */

// triggered on win
function confettifn() {
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    Swal.fire({
        icon: 'success',
        title: 'Congratulations!',
        text: 'You have already succeded at this challenge!'
    })

    confetti({
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        particleCount: randomInRange(50, 100),
        origin: { y: 0.6 }
    });

    setTimeout(() => {
        confetti({
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            particleCount: randomInRange(50, 100),
            origin: { y: 0.6 }
        });
    }, 500);

}

// color the fields according to the answer.
function coloreame(campos, respuesta) {
    for (let index = 0; index < campos.length; index++) {

        switch (respuesta.word[index]) {
            case ("ok" || respuesta.status == "success"):
                campos[index].style.backgroundColor = "#0f0";
                break;
            case "exists":
                campos[index].style.backgroundColor = "#ff0";
                break;
            case "null":
                campos[index].style.backgroundColor = "#f00";
                break;
        }
    }

    if (respuesta.status == "success") {
        confettifn();
    }
}

// on keyboard keypress
function onKeyPress(button) {
    let campos = document.getElementsByName("campo");
    let palabra = "";

    if (button == "{ent}" && campos[campos.length - 1].textContent != "") {
        // if all the fields are fullfilled
        let xhr = new XMLHttpRequest();

        palabra = "";

        for (let index = 0; index < campos.length; index++) {
            palabra = palabra + campos[index].textContent;
        }

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const chlid = urlParams.get('id')

        xhr.open("GET", /* window.location.hostname + window.location.pathname + */ "?action=checkWord&palabra=" + palabra + "&id=" + chlid);

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                res = JSON.parse(xhr.responseText);
                if (res.status == "not logged in") {
                    // if the user is not logged in, show a message.
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'You must be logged in to do that!',
                        footer: 'Please&nbsp;<a href="index.php?action=login">log in</a>&nbsp;or&nbsp;<a href="index.php?action=register">register</a>'
                    })
                } else {
                    // else, color the fields
                    coloreame(campos, res);
                }
            }
        }

        xhr.send();
        heartfn();
    }

    if (button == "{backspace}") {
        for (let i = 0; i < campos.length - 1; i++) {
            var lastfield = campos[i];
            var newfield = campos[i + 1];
            if (newfield.textContent == "") {
                lastfield.textContent = "";
            }

            if (newfield == campos[campos.length - 1]) {
                newfield.textContent = "";
            }

        }
    } else if (button != "{ent}") {
        for (let i = 0; i < campos.length; i++) {
            /* palabra = palabra + campos[i].textContent; */
            /* console.log(typeof button); */

            if (campos[i].textContent.length == 0) {
                campos[i].textContent = button;
                break;
            }
        }
    }
    console.log("Button pressed", button);
}

window.onload = heartfn;