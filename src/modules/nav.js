// contains functinality related to the navbar
const nav = document.querySelector('nav');

let oldScrollY = window.scrollY;
window.onscroll = function () {
  if (oldScrollY < window.scrollY) {
    // scrolling down
    nav.style.background = 'var(--overlay-grey)';
  }

  if (window.scrollY === 0) nav.style.background = 'transparent';

  oldScrollY = window.scrollY;
};
