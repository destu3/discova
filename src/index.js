import { showSrchBar, hideSrchBar } from './modules/nav';
import {
  createTrending,
  createPopularRn,
  createPopular,
  createUpcoming,
} from './modules/featured_sect';
import { alternatePopular } from './modules/hero';
import { renderResults, handleInfiniteScroll } from './modules/results';

// Dom selection
const searchBar = document.querySelectorAll('.search-param');

// event listners
document.addEventListener('DOMContentLoaded', () => {
  alternatePopular();
  createFeaturedSects();
});

searchBar.forEach(searchBar => {
  searchBar.addEventListener('input', function (e) {
    renderResults(this.value);
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

const searchBar_ = document.querySelector('.search-param');
window.addEventListener('scroll', () => {
  handleInfiniteScroll(searchBar_.value);
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
