import Swiper from 'swiper/bundle';
import { showInfo } from './overlay';
import 'swiper/css/bundle';
import { QUERIES_AND_VARIABLES, getMedia } from './gql';
import { createGenreTag } from './media';

const swiper = document.querySelector('.swiper').swiper;

/* 
fetches a random list of popular anime,
creates slide components for each, and adds
to slider. 
*/
export async function alternatePopular() {
  const rand = Math.floor(Math.random() * 15) + 1;
  const popular = await getMedia(QUERIES_AND_VARIABLES.allTimePopular.query, {
    page: rand,
    perPage: 20,
  });

  setHero(popular);
}

// creates and adds slides to slider
function renderSlides(heroData, heroWrapper) {
  heroData.forEach((hero, arr) => {
    const genres = hero.genres;

    const html = `
    <div class="swiper-slide hero-featured h-full w-full cursor-pointer" data-media_id="${
      hero.id
    }">
    <div
      class="background absolute top-0 right-0 left-0 bottom-0 blur hero-img bg-center ${
        hero.bannerImage ? 'bg-cover' : 'bg-[length:400px_100%]'
      } bg-repeat"
      style="
        background-image: linear-gradient(
            rgba(0, 0, 0, 0.7),
            rgba(0, 0, 0, 0.7)
          ),
          url(${hero.bannerImage ? hero.bannerImage : hero.coverImage.large});
      "
    ></div>
    <div class="content w-full absolute left-0 top-0 right-0 bottom-0 flex">
      <img class="featured-poster h-full w-auto" src="${
        hero.coverImage.extraLarge
      }" />
      <div class="featured-info p-4 flex-1 overflow-hidden">
          <header class="text-base lg:text-2xl font-medium text-[var(--main-brand)] mb-2">${
            hero.title?.english || hero.title?.romaji || hero.title?.native
          }</header>
          <p class="lg:text-lg font-medium mb-3 lg:mb-5 text-[var(--main-text)] featured-desc">${
            hero.description
          }</p>
          <div class="text-[var(--main-text)] items-center featured-genres max-w-[100%] whitespace-nowrap overflow-hidden overflow-ellipsis">
          <i class="fa-solid fa-tags lg:text-lg text-[var(--main-text)] pr-[5px]"></i>
            ${genres
              .map(genre =>
                createGenreTag(
                  genre,
                  'lg:text-lg',
                  'text-[var(--main-text)]',
                  'pr-[10px]'
                )
              )
              .join('')}
          </div>
        
      </div>
    </div>
  </div>

    `;
    heroWrapper.insertAdjacentHTML('beforeend', html);
  });
}

// initializes slider and adds slides to it
function setHero(heroData) {
  let swiper = new Swiper('.mySwiper', {
    slidesPerView: 1,
    speed: 1000,
    rewind: true,
    autoplay: {
      delay: 10000,
      disableOnInteraction: false,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: false,
    },
    observer: true,
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
      clickable: true,
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  const heroWrapper = document.querySelector('.mySwiper .swiper-wrapper');
  renderSlides(heroData, heroWrapper);

  // add event listener to each featured slide
  document.querySelectorAll('.hero-featured').forEach(function (featuredHero) {
    featuredHero.addEventListener('click', function () {
      if (this !== document.querySelector('.featured-genres'))
        showInfo.call(featuredHero);
    });
  });
}
