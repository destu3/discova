// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';

const urls = [
  'https://simkl.in/fanart/23/235671bcb4748f2_medium.jpg',
  'https://simkl.in/fanart/78/7866146f1a7774b71_medium.jpg',
  'https://simkl.in/fanart/26/26949489c133252ba_medium.jpg',
  'https://simkl.in/fanart/55/5524950da1313b4b4_medium.jpg',
  'https://simkl.in/fanart/44/4425394710046a7c0_medium.jpg',
  'https://simkl.in/fanart/10/108030648258dadd46_medium.jpg',
  'https://simkl.in/fanart/79/79548626bb3ec6928_medium.jpg',
  'https://simkl.in/fanart/73/73280323330db86ab_medium.jpg',
  'https://simkl.in/fanart/87/8765949872f257c_medium.jpg',
  'https://simkl.in/fanart/11/11422118eba2682553_medium.jpg',
  'https://simkl.in/fanart/65/650992e9ede4ae04_medium.jpg',
  'https://simkl.in/fanart/40/405800bc56d3985_medium.jpg',
  'https://simkl.in/fanart/11/11273280feb90e29bd_medium.jpg',
  'https://simkl.in/fanart/65/653633689c28fa6e1_medium.jpg',
  'https://simkl.in/fanart/77/777043876832e3e14_medium.jpg',
  'https://simkl.in/fanart/11/11025094781fc93484_medium.jpg',
  'https://simkl.in/fanart/11/11349056c8e88703c5_medium.jpg',
  'https://simkl.in/fanart/26/26852426f1718c4f3_medium.jpg',
  'https://simkl.in/fanart/11/11138030713940bd7d_medium.jpg',
  'https://simkl.in/fanart/87/87940023141e798e2_medium.jpg',
];

import { QUERIES_AND_VARIABLES, getMedia } from './gql';
export async function alternateImages() {
  //   const cid =
  //     'e252f66035077a6486bccd69d2b650f55bf004f99d1e5c185afeaa559697e920';
  //   const popular = await getMedia(QUERIES_AND_VARIABLES.allTimePopular.query, {
  //     page: 1,
  //     perPage: 20,
  //   });
  //   const ids = popular.map(anime => anime.idMal);
  //   const responses = await Promise.all(
  //     ids.map(async id => {
  //       const res = await fetch(
  //         `https://api.simkl.com/search/id?mal=${id}&client_id=${cid}`
  //       ); // Send request for each id
  //       return res.json();
  //     })
  //   );
  //   const simklIds = responses.map(res => {
  //     const [data] = res;
  //     return data.ids.simkl;
  //   });
  //   const responses_ex = await Promise.all(
  //     simklIds.map(async simklId => {
  //       const res = await fetch(
  //         `https://api.simkl.com/anime/${simklId}?extended=full&client_id=${cid}`
  //       ); // Send request for each id
  //       return res.json();
  //     })
  //   );

  //   const images = responses_ex.map(ex => buildHeroImageUrl(ex.fanart));

  setHeroImages(urls);
}

function setHeroImages(images) {
  let swiper = new Swiper('.mySwiper', {
    spaceBetween: 30,
    centeredSlides: true,
    speed: 1500,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  const heroWrapper = document.querySelector('.mySwiper .swiper-wrapper');
  images.forEach(img => {
    const html = `<div class="swiper-slide h-full w-full hero-img" style="background-image:linear-gradient(rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5)), url(${img})"></div>`;
    heroWrapper.insertAdjacentHTML('beforeend', html);
  });
}

function buildHeroImageUrl(path) {
  return `https://simkl.in/fanart/${path}_medium.jpg`;
}
