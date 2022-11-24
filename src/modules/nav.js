// contains functinality related to the navbar
const nav = document.querySelector('nav');

export const showSrchBar = function (searchBtn, searchBar) {
  searchBar.classList.add('_visible');
  searchBtn.classList.add('_hidden');
};

export const hideSrchBar = function (searchBtn, searchBar) {
  searchBar.classList.remove('_visible');
  searchBtn.classList.remove('_hidden');
};

let oldScrollY = window.scrollY;
window.onscroll = function () {
  if (oldScrollY < window.scrollY) {
    // scrolling down
    nav.style.background = 'var(--overlay-grey)';
  }

  if (window.scrollY === 0) nav.style.background = 'transparent';

  oldScrollY = window.scrollY;
};
