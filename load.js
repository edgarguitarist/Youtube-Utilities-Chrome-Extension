function getLocalStorage(callback) {
    chrome.storage.local.get(['yt-shortcuts'], function (result) {
        const data = result['yt-shortcuts'] || {
            newButton: false,
            OAChecker: false,
            DarkMode: false,
        };
        callback(data);
    });
}

function setLocalStorage(data, callback) {
    chrome.storage.local.set({ 'yt-shortcuts': data }, function () {
        console.log('Datos guardados en chrome.storage.local');
        if (callback) {
            callback();
        }
    });
}

function getDarkMode(callback) {
    getLocalStorage(function (data) {
        callback(data.DarkMode);
    });
}

function setDarkMode(isDarkMode, callback) {
    getLocalStorage(function (data) {
        data.DarkMode = isDarkMode;
        setLocalStorage(data, function () {
            if (callback) {
                callback(data.DarkMode);
            }
        });
    });
}

const body = document.getElementsByTagName('body')[0];
const darkModeToggle = document.getElementById('dark-mode-toggle');

if (darkModeToggle !== null) {
    darkModeToggle.addEventListener('change', function () {
        setDarkMode(darkModeToggle.checked, function (isDarkMode) {
            darkModeToggle.checked = isDarkMode;
        });
    });

    body.onload = function () {
        console.log('load');
        getDarkMode(function (isDarkMode) {
            darkModeToggle.checked = isDarkMode;
        });
    };

    // Escuchar cambios en chrome.storage.local
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'local' && changes['yt-shortcuts']) {
            const newValues = changes['yt-shortcuts'].newValue;
            if (newValues.DarkMode !== undefined) {
                darkModeToggle.checked = newValues.DarkMode;
            }
        }
    });
}
