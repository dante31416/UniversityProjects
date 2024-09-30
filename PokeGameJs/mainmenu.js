
var mainMenu;
//var credits;
var startButton;
//var creditsButton;

function MainMenuSetup(onStart) {
    mainMenu = document.getElementById("mainMenu");
    startButton = document.getElementById("menuStart");
    startButton.onclick = () => {
        mainMenu.setAttribute('style', 'left: -900px');
        if (typeof(onStart) !== 'undefined') {
            onStart();
        }
    }

   
}

function ShowMenu() {
    mainMenu.setAttribute('style', 'left: 0px');
}

