window.onload = () => {
  setTimeout(function () {
    chrome.storage.local.get(['yt-shortcuts'], function (result) {
      const data = result['yt-shortcuts'] || {
        newButton: false,
        OAChecker: false,
        DarkMode: false,
        Lang: 'en'
      };


      if (data.OAChecker) {
        data.OAChecker = false;
        OA();
      }

      if (data.newButton) {
        createNewButtons("dislike");
        createNewButtons("like");
        createNewButtons("n");
      }

      chrome.storage.onChanged.addListener(function (changes, namespace) {
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

      function getButtons() {
        let wrapper = document.querySelectorAll('.YtSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper')
        if (!wrapper.length) return { buttonLike: null, buttonDisLike: null }
        wrapper = Array.from(wrapper[0]?.childNodes)
        const [buttonLike, buttonDisLike] = wrapper.map((e) => e.querySelector('toggle-button-view-model > button-view-model > button'))
        return {
          buttonLike,
          buttonDisLike,
        }
      }

      function createNewButtons(name) {
        const { buttonLike, buttonDisLike } = getButtons();
        if (!buttonLike || !buttonDisLike) return;
        let pressed
        if (name === "like") {
          buttonLike.addEventListener("click", () => {
            pressed = buttonLike.getAttribute("aria-pressed");
            toggleIcon(pressed);
          });
        } else {
          buttonDisLike.addEventListener("click", () => {
            pressed = buttonDisLike.getAttribute("aria-pressed");
            toggleIcon(pressed);
          });
        }

        const conf = {
          like: {
            id: "img_like_yt",
            icon_pressed: "mdi:thumb-up.svg",
            icon: "mdi:thumb-up-outline.svg",
            other: "dislike"
          },
          dislike: {
            id: "img_dislike_yt",
            icon_pressed: "mdi:thumb-down.svg",
            icon: "mdi:thumb-down-outline.svg",
            other: "like"
          },
          n: {
            id: "img_skip_ad_yt",
            icon: "icon-park-outline/ad.svg",
            icon_pressed: "icon-park-solid/ad.svg",
            other: ""
          }
        }

        let icon = conf[name].icon;
        const img = document.createElement("img");
        img.src = `https://api.iconify.design/${icon}`;
        img.id = conf[name].id;
        img.style = "filter: invert(1); width: inherit;";

        const right_controls = document.querySelector("div.ytp-right-controls");

        const newButton = right_controls
          .querySelector("button.ytp-fullscreen-button.ytp-button")
          .cloneNode(true);

        newButton.id = `newButtons-${name}`;
        newButton.style = "width: 24px; position: relative; top: -12px; margin-right: 20px;";
        newButton.classList.remove("ytp-fullscreen-button");
        newButton.setAttribute(
          "title",
          `${name[0].toUpperCase() + name.slice(1)}`
        );
        newButton.setAttribute("aria-label", name);
        newButton.setAttribute("data-title-no-tooltip", name);
        newButton.setAttribute("aria-keyshortcuts", name[0]);

        const toggleIcon = (pressed) => {
          if (conf[name].other) {
            const b = document.querySelector(`#${conf[conf[name].other].id}`)
            let icon = conf[conf[name].other].icon;
            b.src = `https://api.iconify.design/${icon}`;
          }
          if (name === "n") {
            pressed = data.OAChecker ? "false" : "true";
          }
          const icon2 = pressed === "true" ? conf[name].icon_pressed : conf[name].icon;
          img.src = `https://api.iconify.design/${icon2}`;
        }

        newButton.onclick = () => {
          actions(name);
          toggleIcon(pressed);
        };

        newButton.removeChild(newButton.childNodes[0]);
        newButton.appendChild(img);
        right_controls.insertBefore(newButton, right_controls.firstChild);
      }

      function toggleNewButtons() {
        data.newButton = !data.newButton;
        chrome.storage.local.set({ 'yt-shortcuts': data }, function () {
          console.log('Datos guardados en chrome.storage.local');
        });

        if (data.newButton) {
          createNewButtons("dislike");
          createNewButtons("like");
          createNewButtons("n");
        } else {
          document.querySelectorAll("#newButtons").forEach((e) => e.remove());
        }
      }

      function hacerClicEnBotonOA() {
        const boton = document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
        if (boton) {
          boton.click();
          console.log('Se ha hecho clic en el botón', new Date());
        }
        console.log('OA activo');
      }

      function OA() {
        data.OAChecker = !data.OAChecker;
        let interval = 3 * 1000; // 3 segundos
        let clicker = setInterval(() => {
          if (!data.OAChecker) {
            clearInterval(clicker);
            console.log('OA desactivado');
          } else {
            hacerClicEnBotonOA();
          }
        }, interval);

        chrome.storage.local.set({ 'yt-shortcuts': data }, function () {
          console.log('Datos guardados en chrome.storage.local');
        });
      }

      function actions(method) {

        const { buttonLike, buttonDisLike } = getButtons();

        const methods = {
          a: buttonLike,
          d: buttonDisLike,
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

  }, 3000); // tiempo de espera hasta que se cargue el DOM

};


