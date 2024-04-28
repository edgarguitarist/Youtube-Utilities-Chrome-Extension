const DATA_BUTTONS = {
  like: {
    id: "img_like_yt",
    icon_pressed: "mdi:thumb-up.svg",
    icon: "mdi:thumb-up-outline.svg",
    other: "dislike",
    key: "d"
  },
  dislike: {
    id: "img_dislike_yt",
    icon_pressed: "mdi:thumb-down.svg",
    icon: "mdi:thumb-down-outline.svg",
    other: "like",
    key: "a"
  }
};

const AWAIT_DOM_SECONDS = 3.5;
const AWAIT_SKIP_SECONDS = 2;


window.onload = () => {
  setTimeout(function () {
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
      return button?.getAttribute("aria-pressed") === "true";
    }

    createButton = (name, newButton, original) => {

      const ICON = document.createElement("img");

      let icon = getAriaPressed(original) ? DATA_BUTTONS[name].icon_pressed : DATA_BUTTONS[name].icon;

      ICON.src = `https://api.iconify.design/${icon}`;
      ICON.id = DATA_BUTTONS[name].id;
      ICON.style = "filter: invert(1); width: inherit;";

      let button = newButton.cloneNode(true);

      button.removeChild(button.firstChild);
      button.appendChild(ICON);

      button.id = `newButtons-${name}`;
      button.style = "width: 24px; position: relative; top: -12px; margin-right: 20px;";
      button.classList.remove("ytp-fullscreen-button");
      button.setAttribute(
        "title",
        `${name[0].toUpperCase() + name.slice(1)}`
      );
      button.setAttribute("aria-label", name);
      button.setAttribute("data-title-no-tooltip", name);
      button.setAttribute("aria-keyshortcuts", DATA_BUTTONS[name].key);

      button.addEventListener("click", () => {
        let icon = getAriaPressed(original) ? DATA_BUTTONS[name].icon : DATA_BUTTONS[name].icon_pressed;
        ICON.src = `https://api.iconify.design/${icon}`;
        oppositeButton = document.getElementById(`newButtons-${DATA_BUTTONS[name].other}`);
        oppositeButton.firstChild.src = `https://api.iconify.design/${DATA_BUTTONS[DATA_BUTTONS[name].other].icon}`;
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

      right_controls.insertBefore(dislike, right_controls.firstChild);
      right_controls.insertBefore(like, right_controls.firstChild);
    }

    let intervalButtons = setInterval(() => {
      if (getButtons().buttonLike) {
        createNewButtons();
        clearInterval(intervalButtons);
      }
    }, 1000);

    function OmitirButton() {
      const skipButton = document.querySelector('.ytp-ad-skip-button-modern.ytp-button');
      if (!skipButton) return;
      setTimeout(() => {
        skipButton.click();
        console.log('Se ha omitido el anuncio', new Date());
      }, AWAIT_SKIP_SECONDS*1000);
    }

    function observarCambiosEnDOM() {
      let elements = document.getElementsByTagName('ytd-watch-flexy');
      let targetNode = elements[0];
      let config = { childList: true, subtree: true };
      let observer = new MutationObserver(mutations => {
        OmitirButton()
      });
      observer.observe(targetNode, config);
    }

    observarCambiosEnDOM();

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
  }, AWAIT_DOM_SECONDS*1000); // tiempo de espera hasta que se cargue el DOM
};


