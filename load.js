function getLocalStorage() {
    return JSON.parse(localStorage.getItem("yt-shortcuts"));
}

function setLocalStorage(data) {
    localStorage.setItem("yt-shortcuts", JSON.stringify(data));
}


const data = getLocalStorage() || {
    newButton: false, 
    OAChecker: false,
    DarkMode: false,
};


function getDarkMode() {
    return data.DarkMode;
}

function setDarkMode() {
    data.DarkMode = !data.DarkMode;
    setLocalStorage(data);
}
const body = document.getElementsByTagName('body')[0];
const darkModeToggle = document.getElementById('dark-mode-toggle');

if(getDarkMode()) {
    darkModeToggle.checked = true;
}

body.onload = () => {
    console.log('load');
    darkModeToggle.addEventListener('change', () => {
        setDarkMode()
    });
}