// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css/bundle';

import { QUERIES_AND_VARIABLES, getMedia } from './gql';

const swiper = document.querySelector('.swiper').swiper;

export async function alternateHeroImgs() {
  const res = await fetch('../src/local-data/heroes.json');
  const heroData = await res.json();

  setHero(heroData);

  //LIMITED TO 1000 REQUESTS A DAY. SO USING heroes.json
  // const cid =
  //   'e252f66035077a6486bccd69d2b650f55bf004f99d1e5c185afeaa559697e920';
  // const popular = await getMedia(QUERIES_AND_VARIABLES.allTimePopular.query, {
  //   page: 11,
  //   perPage: 20,
  // });
  // const ids = popular.map(anime => anime.idMal);
  // const responses = await Promise.all(
  //   ids.map(async id => {
  //     const res = await fetch(
  //       `https://api.simkl.com/search/id?mal=${id}&client_id=${cid}`
  //     ); // Send request for each id
  //     return res.json();
  //   })
  // );
  // const simklIds = responses.map(res => {
  //   const [data] = res;
  //   return data.ids.simkl;
  // });
  // const responses_ex = await Promise.all(
  //   simklIds.map(async simklId => {
  //     const res = await fetch(
  //       `https://api.simkl.com/anime/${simklId}?extended=full&client_id=${cid}`
  //     ); // Send request for each id
  //     return res.json();
  //   })
  // );

  // const heroContent = responses_ex.map(ex => {
  //   console.log(ex);
  //   return {
  //     title: ex.en_title || ex.title,
  //     heroImg: buildHeroImage(ex.fanart),
  //     heroImgSm: buildHeroImageMob(ex.poster),
  //     overview: ex.overview,
  //     idMal: ex.ids.mal,
  //   };
  // });

  // console.log(JSON.stringify(heroContent));
}

function setHero(heroData) {
  let swiper = new Swiper('.mySwiper', {
    speed: 1500,
    spaceBetween: 0,
    slidesPerView: 1,
    simulateTouch: false,
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    autoplay: {
      delay: 10000,
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
  heroData.forEach((hero, i, arr) => {
    const rand = arr[Math.floor(Math.random() * arr.length)];
    const html = `
    <div class="swiper-slide h-full w-full hero-img relative" style="background-image:linear-gradient(rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.6)), url(${rand.heroImg})">
      <div class="hero-info w-[80%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <h1 class="hero-title text-4xl md:text-5xl font-bold text-white">${rand.title}</h1>
          <div class="flex flex-col sm:flex-row gap-4 mt-5">
            <button class="hero add font-roboto font-medium"><i class="fa-solid fa-plus mr-2"></i>Add to List</button>
            <button class="hero more-info font-medium"><i class="fa-solid fa-circle-info mr-2"></i>More Info</button>
          </div>
      </div>
    </div>
    `;
    heroWrapper.insertAdjacentHTML('beforeend', html);
  });
}

function buildHeroImage(path) {
  return `https://simkl.in/fanart/${path}_medium.jpg`;
}

function buildHeroImageMob(path) {
  return `https://simkl.in/posters/${path}_m.jpg`;
}