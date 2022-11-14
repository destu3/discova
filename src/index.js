import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { showSrchBar, hideSrchBar } from './modules/nav';

// Dom selection
const srchBtn = document.querySelector('.search-btn');
const srchBar = document.querySelector('.search-bar');
const hideSrchBarBtn = document.querySelector('.hide-search-bar');

// event listners
srchBtn.addEventListener('click', () => {
  showSrchBar(srchBtn, srchBar);
});

hideSrchBarBtn.addEventListener('click', () => {
  hideSrchBar(srchBtn, srchBar);
});
// document.body.addEventListener('click', () => {
//   hideSrchBar(srchBtn, srchBar);
// });

const swiper = new Swiper('.mySwiper', {
  slidesPerView: 3,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});
