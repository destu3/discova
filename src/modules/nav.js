const nav = document.querySelector('nav');

let oldScrollY = window.scrollY;
// changes navbar colour based on scroll position
export function changeNavColour() {
  if (oldScrollY < window.scrollY) {
    // scrolling down
    nav.style.background = 'var(--overlay-grey)';
  }

  if (window.scrollY === 0) nav.style.background = 'transparent';

  oldScrollY = window.scrollY;
}
