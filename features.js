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
  }
};



window.onload = () => {
  setTimeout(function () {
    chrome.storage.local.get(['yt-shortcuts'], function (result) {
      const data = result['yt-shortcuts'] || {      
        DarkMode: true,
        Lang: 'en'
      };


      function checkNoFocus() {
        return (
          document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA" &&
          document.activeElement.id !== "search" &&
          document.activeElement.id !== "contenteditable-root"
        );
      }

      function getButtons() {
        let wrapper = document.querySelector('.YtSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper')
        if (!wrapper) return { buttonLike: null, buttonDisLike: null }
        wrapper = Array.from(wrapper?.childNodes)
        const [buttonLike, buttonDisLike] = wrapper.map((e) => e
        .querySelector('toggle-button-view-model > button-view-model > button'))
        return {
          buttonLike,
          buttonDisLike,
        }
      }

      function getAriaPressed(button) {
        return button.getAttribute("aria-pressed") === "true";
      }

      createButton = (name, newButton, original, key) => {

        const img = document.createElement("img");

        let icon = getAriaPressed(original) ? conf[name].icon_pressed : conf[name].icon;

        img.src = `https://api.iconify.design/${icon}`;
        img.id = conf[name].id;
        img.style = "filter: invert(1); width: inherit;";
        
        let button = newButton.cloneNode(true);

        button.removeChild(button.firstChild);
        button.appendChild(img);

        button.id = `newButtons-${name}`;
        button.style = "width: 24px; position: relative; top: -12px; margin-right: 20px;";
        button.classList.remove("ytp-fullscreen-button");
        button.setAttribute(
          "title",
          `${name[0].toUpperCase() + name.slice(1)}`
        );
        button.setAttribute("aria-label", name);
        button.setAttribute("data-title-no-tooltip", name);
        button.setAttribute("aria-keyshortcuts", key);

        button.addEventListener("click", () => {
          console.log(name, original);
          let icon = getAriaPressed(original) ? conf[name].icon : conf[name].icon_pressed;
          img.src = `https://api.iconify.design/${icon}`;
          oppositeButton = document.getElementById(`newButtons-${conf[name].other}`);
          oppositeButton.firstChild.src = `https://api.iconify.design/${conf[conf[name].other].icon}`;

          original.click();
        });
        return button;        
      }


      function createNewButtons() {
        const { buttonLike, buttonDisLike } = getButtons();
        const right_controls = document.querySelector("div.ytp-right-controls");
        const clonedButton = right_controls
        .querySelector("button.ytp-fullscreen-button.ytp-button")
        .cloneNode(true);        

        let like = createButton("like", clonedButton, buttonLike);
        let dislike = createButton("dislike", clonedButton, buttonDisLike);

        right_controls.insertBefore(dislike, right_controls.firstChild, 'd');
        right_controls.insertBefore(like, right_controls.firstChild, 'a');
      }

      createNewButtons();      

      function OmitirButton() {
        const boton = document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
        if (boton) {
          boton.click();
          console.log('Se ha hecho clic en el botón', new Date());
        }
      }

      function OA() {
        let interval = 3 * 1000; // 3 segundos
        let clicker = setInterval(() => {
          OmitirButton();
        }, interval);        
      }

      OA();

      function actions(method) {

        const { buttonLike, buttonDisLike } = getButtons();
        const methods = {
          a: buttonLike,
          d: buttonDisLike,
          like: buttonLike,
          dislike: buttonDisLike,
        };
        if (methods[method] && checkNoFocus()) {          
          methods[method].click();          
        }
      }

      document.addEventListener("keydown", (e) => {
        actions(e.key);
      });
    });

  }, 3000); // tiempo de espera hasta que se cargue el DOM

};


