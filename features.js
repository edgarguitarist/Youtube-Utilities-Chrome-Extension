function getLocalStorage() {
  return JSON.parse(localStorage.getItem("yt-shortcuts"));
}

function setLocalStorage(data) {
  localStorage.setItem("yt-shortcuts", JSON.stringify(data));
}

const data = getLocalStorage() || {
  newButton: false, //consider to add more data options here
};

window.onload = () => {
  function actions(method) {
    const menuOptions = document.querySelectorAll(
      "ytd-menu-renderer.style-scope.ytd-watch-metadata > div#top-level-buttons-computed"
    );

    const [buttonLike, buttonDisLike] = menuOptions[0].querySelectorAll(
      "ytd-toggle-button-renderer > yt-button-shape > button"
    ); //like & dislike button selector
    const buttonShare = menuOptions[0].querySelector(
      "ytd-button-renderer > yt-button-shape > button"
    );

    function checkNoFocus() {
      return (
        document.activeElement.tagName !== "INPUT" &&
        document.activeElement.tagName !== "TEXTAREA" &&
        document.activeElement.id !== "search" &&
        document.activeElement.id !== "contenteditable-root"
      );
    }

    function toggleNewButtons() {
      data.newButton = !data.newButton;
      setLocalStorage(data);
      if (data.newButton) {
        createNewButtons("dislike");
        createNewButtons("like");
      } else {
        document.querySelectorAll("#newButtons").forEach((e) => e.remove());
      }
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
      newButton.setAttribute("title", `${name[0].toUpperCase()+name.slice(1)}}`);
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

    const methods = {
      a: buttonLike,
      d: buttonDisLike,
      s: buttonShare,
      x: 1,
      like: buttonLike,
      dislike: buttonDisLike,
    };

    if (methods[method] && checkNoFocus()) {
      if (method !== "x") {
        methods[method].click();
      }
      if (method === "x") {
        toggleNewButtons();
      }
    }
  }

  document.addEventListener("keydown", (e) => {
    actions(e.key);
  });
};
