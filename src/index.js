import {
  createTrending,
  createPopularRn,
  createPopular,
  createUpcoming,
} from './modules/featured_sect';
import { changeNavColour } from './modules/nav';
import { alternatePopular } from './modules/hero';
import { renderResults, handleInfiniteScroll } from './modules/results';
import { setupThemesAccordion } from './modules/overlay';
import 'overlayscrollbars/overlayscrollbars.css';
import { OverlayScrollbars } from 'overlayscrollbars';

// Dom selection
const searchBar = document.querySelectorAll('.search-param');

// event listners
document.addEventListener('DOMContentLoaded', async () => {
  alternatePopular();
  createFeaturedSects();
  setupThemesAccordion();
});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

window.addEventListener('scroll', function () {
  handleInfiniteScroll(currSearch);
  changeNavColour();
});

// initialize custom scrollbars
const osModal = OverlayScrollbars(document.querySelector('.info-modal'), {});
export const osBody = OverlayScrollbars(document.querySelector('body'), {
  scrollbars: {
    theme: 'os-theme-light',
  },
});

let currSearch = null;
// get data based on search bar value
searchBar.forEach(searchBar => {
  searchBar.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      document.querySelector('.hero').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
      renderResults(this.value);
      currSearch = this.value;
    }
  });
});

// render default landing page if searh bar value is empty
searchBar.forEach(searchBar =>
  searchBar.addEventListener('keyup', function () {
    if (this.value === '')
      if (!document.body.contains(document.querySelector('.featured-sect')))
        createFeaturedSects();
  })
);

// create featured sections
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
