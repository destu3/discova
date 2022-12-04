import {
  createTrending,
  createPopularRn,
  createPopular,
  createUpcoming,
} from './modules/featured_sect';
import { changeNavColour } from './modules/nav';
import { alternatePopular } from './modules/hero';
import { renderResults, handleInfiniteScroll } from './modules/results';

// Dom selection
const searchBar = document.querySelectorAll('.search-param');

// event listners
document.addEventListener('DOMContentLoaded', () => {
  alternatePopular();
  createFeaturedSects();
});

let currSearch = null;
searchBar.forEach(searchBar => {
  searchBar.addEventListener('input', function (e) {
    renderResults(this.value);
    currSearch = this.value;
  });
});

searchBar.forEach(searchBar =>
  searchBar.addEventListener('keyup', function () {
    if (this.value === '')
      if (!document.body.contains(document.querySelector('.featured-sect')))
        createFeaturedSects();
  })
);

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener('scroll', () => {
  handleInfiniteScroll(currSearch);
  changeNavColour();
});

function createFeaturedSects() {
  if (document.body.contains(document.querySelector('.results-container'))) {
    const results = document.querySelector('.results-container');
    results.parentNode.removeChild(results);
  }
  createTrending();
  createPopularRn();
  createUpcoming();
  createPopular();
}
