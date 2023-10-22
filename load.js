function getLocalStorage(callback) {
    chrome.storage.local.get(['yt-shortcuts'], function(result) {
        const data = result['yt-shortcuts'] || {
            newButton: false, 
            OAChecker: false,
            DarkMode: false,
        };
        callback(data);
    });
}

function setLocalStorage(data, callback) {
    chrome.storage.local.set({'yt-shortcuts': data}, function() {
        console.log('Datos guardados en chrome.storage.local');
        if (callback) {
            callback();
        }
    });
}

function getDarkMode(callback) {
    getLocalStorage(function(data) {
        callback(data.DarkMode);
    });
}

function setDarkMode(callback) {
    getLocalStorage(function(data) {
        data.DarkMode = !data.DarkMode;
        setLocalStorage(data, function() {
            if (callback) {
                callback(data.DarkMode);
            }
        });
    });
}

const body = document.getElementsByTagName('body')[0];
const darkModeToggle = document.getElementById('dark-mode-toggle');

//si existe darkModeToggle, entonces estamos en la página de opciones
if (darkModeToggle !== null) {
    darkModeToggle.addEventListener('change', function() {
        setDarkMode(function(isDarkMode) {
            darkModeToggle.checked = isDarkMode;
        });
    });
    
    body.onload = function() {
        console.log('load');
        getDarkMode(function(isDarkMode) {
            darkModeToggle.checked = isDarkMode;
        });
    };    
}

