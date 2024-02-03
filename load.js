function getLocalStorage(callback) {
    chrome.storage.local.get(['yt-shortcuts'], function (result) {
        const data = result['yt-shortcuts'] || {
            newButton: false,
            OAChecker: false,
            DarkMode: false,
            Lang: 'en'
        };
        callback(data);
    });
}

function setLocalStorage(data, callback) {
    chrome.storage.local.set({ 'yt-shortcuts': data }, function () {
        if (callback) {
            callback();
        }
    });
}

function getValue(key, callback) {
    getLocalStorage(function (data) {
        callback(data[key]);
    });
}

function setValue(key, value, callback) {
    getLocalStorage(function (data) {
        data[key] = value;
        setLocalStorage(data, function () {
            if (callback) {
                callback(data[key]);
            }
        });
    });
}



const body = document.getElementsByTagName('body')[0];
const darkModeToggle = document.getElementById('dark-mode-toggle');
const langToggle = document.getElementById('lang-toggle');
const secondsInput = document.getElementById('seconds');

if (darkModeToggle !== null) {
    darkModeToggle.addEventListener('change', function () {
        setValue('DarkMode',darkModeToggle.checked, function (value) {
            darkModeToggle.checked = value;
        });        
    });

    langToggle.addEventListener('change', function () {
        setValue('Lang',langToggle.checked, function (value) {
            langToggle.checked = value;
            handleLangToggle();
        });        
    });

    secondsInput.addEventListener('change', function () {
        setValue('seconds',secondsInput.value, function (value) {
            secondsInput.value = value;
        });
    });

    body.onload = function () {
        getValue('DarkMode',function (value) {
            darkModeToggle.checked = value;
        });

        getValue('Lang',function (value) {
            langToggle.checked = value;
            handleLangToggle();
        });

        getValue('seconds',function (value) {
            secondsInput.value = value;
        });
    };

    // Escuchar cambios en chrome.storage.local
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        if (namespace === 'local' && changes['yt-shortcuts']) {
            const newValues = changes['yt-shortcuts'].newValue;
            if (newValues.DarkMode !== undefined) {
                darkModeToggle.checked = newValues.DarkMode;
            }
            if (newValues.Lang !== undefined) {
                langToggle.checked = newValues.Lang;
                handleLangToggle();
            }
            if (newValues.seconds !== undefined) {
                secondsInput.value = newValues.seconds;
            }
        }
    });
}


const textos = {
    es: {
        title: 'YouTube Utilidades',
        langToggleLabel: 'Ingles',
        darkModeToggleLabel: 'Modo Oscuro',
        actionsHeader: 'Acciones Disponibles 🔮✨',
        likeAction: 'Presiona <strong>"A"</strong> para dar Me gusta a un video 👍🏽',
        dislikeAction: 'Presiona <strong>"D"</strong> para dar No me gusta a un video 👎🏽',        
        playerButtonsAction: 'Presiona <strong>"X"</strong> para añadir botones de Me gusta y No me gusta al reproductor de video 📺',
        skipAdsAction: 'Presiona <strong>"N"</strong> para Omitir Anuncios Automáticamente ⛔',
        developer: 'Desarrollado con ❤️ por <a href="https://github.com/edgarguitarist">edgarguitarist</a>'
    },
    en: {
        title: 'YouTube Utilities',
        langToggleLabel: 'Spanish',
        darkModeToggleLabel: 'Dark Mode',
        actionsHeader: 'Available Actions 🔮✨',
        likeAction: 'Press <strong>"A"</strong> to Like a video 👍🏽',
        dislikeAction: 'Press <strong>"D"</strong> to Dislike a video 👎🏽',
        playerButtonsAction: 'Press <strong>"X"</strong> to Add Like & Dislike buttons to Video Player 📺',
        skipAdsAction: 'Press <strong>"N"</strong> to Auto-Skip Ads ⛔',
        developer: 'Developed with ❤️ by <a href="https://github.com/edgarguitarist">edgarguitarist</a>'
    }
};

function handleLangToggle() {    
    const lang = langToggle.checked ? 'es' : 'en';
    const langTexts = textos[lang];
    document.title = langTexts.title;
    document.getElementById('title').innerHTML = langTexts.title;
    document.getElementById('label-lang-toggle').title = langTexts.langToggleLabel;
    document.getElementById('label-dark-mode-toggle').title = langTexts.darkModeToggleLabel;
    document.getElementById('actions-header').innerHTML = langTexts.actionsHeader;
    document.getElementById('like-action').innerHTML = langTexts.likeAction;
    document.getElementById('dislike-action').innerHTML = langTexts.dislikeAction;
    document.getElementById('player-buttons-action').innerHTML = langTexts.playerButtonsAction;
    document.getElementById('skip-ads-action').innerHTML = langTexts.skipAdsAction;
    document.getElementById('developer').innerHTML = langTexts.developer;

}
