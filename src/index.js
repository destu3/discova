import { showSrchBar, hideSrchBar } from './modules/nav';
import {
  createTrending,
  createPopularRn,
  createPopular,
  createUpcoming,
} from './modules/featured_sect';

// Dom selection
const srchBtn = document.querySelector('.search-btn');
const srchBar = document.querySelector('.search-bar');
const hideSrchBarBtn = document.querySelector('.hide-search-bar');

// event listners
document.addEventListener('DOMContentLoaded', () => {
  createTrending();
  createPopularRn();
  createUpcoming();
  createPopular();
});

srchBtn.addEventListener('click', () => {
  showSrchBar(srchBtn, srchBar);
});

hideSrchBarBtn.addEventListener('click', () => {
  hideSrchBar(srchBtn, srchBar);
});
