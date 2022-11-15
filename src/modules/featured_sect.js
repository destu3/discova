// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';
// import styles bundle
import 'swiper/css/bundle';

// swiper slider configuration
let swiper = new Swiper('.mySwiper', {
  slidesPerView: 'auto',
  init: false,
  effect: 'slide',
  speed: 1500,
  slidesPerGroupAuto: true,
  spaceBetween: 25,
  pagination: {
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// contains functionality realated to featured section on landing page

const getTrending = async function () {
  const res = await fetch(
    'https://api.consumet.org/meta/anilist/trending?perPage=20'
  );
  const data = await res.json();
  return data;
};

export const createTrendingSect = function () {
  const mainSection = document.querySelector('main');
  const sectTtile = 'Trending Now';
  const sectName = 'trending';
  const section = `<section class="featured-sect ${sectName} w-full">
        <h1 class="sect-title">${sectTtile}</h1>
        <div
          class="swiper mySwiper slider w-full"
        >
          <div class="swiper-wrapper media-wrapper"></div>
          <div class="swiper-button-next !h-[202.54px] md:!h-[265px]"></div>
          <div class="swiper-button-prev !h-[202.54px] md:!h-[265px]"></div>
        </div>
      </section>
    `;

  mainSection.insertAdjacentHTML('beforeend', section);

  getTrending().then(data => {
    const sect = document.querySelector(
      `.featured-sect.${sectName} .swiper .swiper-wrapper`
    );
    data.results.forEach(anime => {
      const mediaCard = `<div class="swiper-slide max-w-[144px] md:max-w-[185px] h-fit rounded-md media-card" data-media_id=${
        anime.id
      }>
        <div class="cover w-full cursor-pointer rounded-md overflow-hidden z-10 inline-block"
          ><img
          class="w-full h-[202.54px] md:h-[265px] object-cover" src="${
            anime.image
          }" alt=""/>
        </div>
        <a href="" class="title text-[0.8rem] md:text-[0.9rem] pt-1 inline-block w-[140px] md:w-[180px] overflow-hidden text-ellipsis">${
          anime.title.english || anime.title.romaji || anime.title.native
        }</a>
      </div>
        `;
      sect.insertAdjacentHTML('beforeend', mediaCard);
    });
    swiper.init();

    const mediaCards = document.querySelectorAll('.media-card');
    mediaCards.forEach(card =>
      card.addEventListener('click', () => console.log(card.dataset.media_id))
    );
  });
};
