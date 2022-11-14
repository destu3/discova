// contains nav bar functionality

export const showSrchBar = function (searchBtn, searchBar) {
  searchBar.classList.add('_visible');
  searchBtn.classList.add('_hidden');
};

export const hideSrchBar = function (searchBtn, searchBar) {
  searchBar.classList.remove('_visible');
  searchBtn.classList.remove('_hidden');
};
