window.onload = () => {
  chrome.storage.local.get(['yt-shortcuts'], function(result) {
    const data = result['yt-shortcuts'] || {
      newButton: false,
      OAChecker: false,
      DarkMode: false,
    };

    if (data.newButton) {
      createNewButtons("dislike");
      createNewButtons("like");
    }

    if (data.OAChecker) {
      data.OAChecker = false;
      OA();
    }

    chrome.storage.onChanged.addListener(function(changes, namespace) {
      if (namespace === 'local' && changes['yt-shortcuts']) {
        const newValues = changes['yt-shortcuts'].newValue;
        if (newValues.newButton !== data.newButton) {
          data.newButton = !newValues.newButton;
          toggleNewButtons();
        }
        if (newValues.OAChecker !== data.OAChecker) {
          data.OAChecker = !newValues.OAChecker;
          OA();
        }
      }
    });

    function checkNoFocus() {
      return (
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA" &&
        document.activeElement.id !== "search" &&
        document.activeElement.id !== "contenteditable-root"
      );
    }

    function createNewButtons(name) {
      const img = document.createElement("img");
      img.src = `https://api.iconify.design/bxs:${name}.svg`;
      img.id = `img_${name}`;
      img.style = "filter: invert(1); width: inherit;";

      const right_controls = document.querySelector("div.ytp-right-controls");

      const newButton = right_controls
        .querySelector("button.ytp-fullscreen-button.ytp-button")
        .cloneNode(true);

      newButton.id = "newButtons";
      newButton.style =
        "width: 24px; position: relative; top: -12px; margin-right: 20px;";
      newButton.classList.remove("ytp-fullscreen-button");
      newButton.setAttribute(
        "title",
        `${name[0].toUpperCase() + name.slice(1)}`
      );
      newButton.setAttribute("aria-label", name);
      newButton.setAttribute("data-title-no-tooltip", name);
      newButton.setAttribute("aria-keyshortcuts", name[0]);

      newButton.onclick = () => {
        actions(name);
      };

      newButton.removeChild(newButton.childNodes[0]);
      newButton.appendChild(img);

      right_controls.insertBefore(newButton, right_controls.firstChild);
    }

    function toggleNewButtons() {
      data.newButton = !data.newButton;
      chrome.storage.local.set({ 'yt-shortcuts': data }, function() {
        console.log('Datos guardados en chrome.storage.local');
      });

      if (data.newButton) {
        createNewButtons("dislike");
        createNewButtons("like");
      } else {
        document.querySelectorAll("#newButtons").forEach((e) => e.remove());
      }
    }

    function hacerClicEnBotonOA() {
      let botones = document.querySelectorAll('.ytp-ad-skip-button.ytp-button');
      botones.forEach(function (boton) {
        if (boton.querySelector('.ytp-ad-skip-button-text').textContent.toLowerCase().includes('anuncio')) {
          boton.click();
          console.log('Se ha hecho clic en el botón', new Date());
        }
      });
      console.log('OA activo');
    }

    function OA() {
      data.OAChecker = !data.OAChecker;
      let clicker = setInterval(() => {
        if (!data.OAChecker) {
          clearInterval(clicker);
          console.log('OA desactivado');
        } else {
          hacerClicEnBotonOA();
        }
      }, 5000);

      chrome.storage.local.set({ 'yt-shortcuts': data }, function() {
        console.log('Datos guardados en chrome.storage.local');
      });
    }

    function actions(method) {
      const menuOptions = document.querySelectorAll(
        "ytd-menu-renderer.style-scope.ytd-watch-metadata > div#top-level-buttons-computed"
      );

      const [buttonLike, buttonDisLike] = menuOptions[0].querySelectorAll(
        "ytd-toggle-button-renderer > yt-button-shape > button"
      );

      const [subscribe, _unsubscribe] = document
        .querySelectorAll("ytd-subscribe-button-renderer")[0]
        .querySelectorAll("yt-button-shape");

      const buttonSubscribe = subscribe.hidden
        ? document.querySelector("#confirm-button > yt-button-shape > button")
        : subscribe.querySelector("button");

      const methods = {
        a: buttonLike,
        d: buttonDisLike,
        s: buttonSubscribe,
        x: 1,
        n: 2,
        like: buttonLike,
        dislike: buttonDisLike,
      };

      if (methods[method] && checkNoFocus()) {
        if (method !== "x" && method !== "n") {
          methods[method].click();
        }
        if (method === "x") {
          toggleNewButtons();
        }
        if (method === "n") {
          OA();
        }
      }
    }

    document.addEventListener("keydown", (e) => {
      actions(e.key);
    });
  });
};

