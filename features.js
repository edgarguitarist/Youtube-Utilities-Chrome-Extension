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

    function OmitirButton() {
      const skipButton = document.querySelector('.ytp-skip-ad-button');
      if (!skipButton) return;
      skipButton.click();
    }

    setInterval(() => {
      OmitirButton();
    }, AWAIT_SKIP_SECONDS * 1000);

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
  }, AWAIT_DOM_SECONDS * 1000); // tiempo de espera hasta que se cargue el DOM
};


