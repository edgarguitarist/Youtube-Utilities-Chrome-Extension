function checkNoFocus() {
  return (
    document.activeElement.tagName !== "INPUT" &&
    document.activeElement.tagName !== "TEXTAREA" &&
    document.activeElement.id !== "search" &&
    document.activeElement.id !== "contenteditable-root"
  );
}

function actions(method) {
  const menuOptions = document.querySelectorAll(
    "ytd-menu-renderer.style-scope.ytd-watch-metadata > div#top-level-buttons-computed"
  );

  const [buttonLike, buttonDisLike] = menuOptions[0].querySelectorAll(
    "ytd-toggle-button-renderer > yt-button-shape > button"
  ); //like & dislike button selector
  const buttonShare = menuOptions[0].querySelector(
    "ytd-button-renderer > yt-button-shape > button"
  ); //share button selector
  const methods = {
    a: buttonLike,
    d: buttonDisLike,
    s: buttonShare,
  };

  if (methods[method] && checkNoFocus()) {
    if (method !== "x") {
      methods[method].click();
      return;
    }
  }
}

window.onload = () => {
  document.addEventListener("keydown", (e) => {
    actions(e.key);
  });
};
