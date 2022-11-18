// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';
// import styles bundle
import 'swiper/css/bundle';
import { getMedia, QUERIES_AND_VARIABLES } from './gql';
import { createMediaCard, hidedets_basic, showdets_basic } from './media';

// contains functionality realated to featured sections on landing page

const getTrending = function () {
  return getMedia(
    QUERIES_AND_VARIABLES.trending.query,
    QUERIES_AND_VARIABLES.trending.variable
  );
};

const getPopularRn = function () {
  return getMedia(
    QUERIES_AND_VARIABLES.popularAiring.query,
    QUERIES_AND_VARIABLES.popularAiring.variable
  );
};

const getUpcoming = function () {
  return getMedia(
    QUERIES_AND_VARIABLES.popularNextSeason.query,
    QUERIES_AND_VARIABLES.popularNextSeason.variable
  );
};

const getPopular = function () {
  return getMedia(
    QUERIES_AND_VARIABLES.allTimePopular.query,
    QUERIES_AND_VARIABLES.allTimePopular.variable
  );
};

const createSeaction = function (sectName, sectTitle) {
  const mainSection = document.querySelector('main');
  const section = `<div class="${sectName} swiper mySwiper slider w-full featured-sect relative bottom-6">
      <h1 class="sect-title">${sectTitle}</h1>
      <div class="swiper-wrapper media-wrapper"></div>
      <div class="swiper-button-next !h-[202.54px] md:!h-[265px]"></div>
      <div class="swiper-button-prev !h-[202.54px] md:!h-[265px]"></div>
    </div>
    `;

  mainSection.insertAdjacentHTML('beforeend', section);
  const sectWrapper = document.querySelector(`.${sectName} .swiper-wrapper`);
  return sectWrapper;
};

const createFeaturedSect = function (sectName, sectTitle, cb) {
  // swiper slider configuration
  let swiper = new Swiper(`.${sectName}.mySwiper`, {
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    slidesPerGroupAuto: true,
    spaceBetween: 20,
    on: {
      transitionStart: function () {
        document
          .querySelectorAll('.swiper-wrapper')
          .forEach(wrapper => (wrapper.style.transitionDuration = '1500ms'));
      },
      init: function () {
        document
          .querySelectorAll('.swiper-wrapper')
          .forEach(wrapper => (wrapper.style.transitionDuration = '500ms'));
      },
      transitionEnd: function () {
        document
          .querySelectorAll('.swiper-wrapper')
          .forEach(wrapper => (wrapper.style.transitionDuration = '500ms'));
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  const sectWrapper = createSeaction(sectName, sectTitle);
  cb().then(result => {
    result.forEach(anime => {
      const card = createMediaCard(anime);
      sectWrapper.insertAdjacentHTML('beforeend', card);
    });
    swiper.init();

    let timeoutId = null;
    const mediaCards = document.querySelectorAll(`.${sectName} .media-card`);
    mediaCards.forEach(card => {
      card.addEventListener('mouseover', function () {
        timeoutId = setTimeout(function () {
          showdets_basic.call(card, sectWrapper);
        }, 500);
      });

      card.addEventListener('mouseleave', function () {
        hidedets_basic.call(card, sectWrapper);
      });

      // cancel function if mouse leaves card before 0.5s
      card.addEventListener('mouseout', function () {
        clearTimeout(timeoutId);
      });
      ///
    });
  });
};

export const createTrending = function () {
  createFeaturedSect('trending', 'Trending', getTrending);
};

export const createPopularRn = function () {
  createFeaturedSect(
    'popular-this-season',
    'Popular this season',
    getPopularRn
  );
};

export const createPopular = function () {
  createFeaturedSect('popular', 'All time popular', getPopular);
};

export const createUpcoming = function () {
  createFeaturedSect('upcoming', 'Upcoming next season', getUpcoming);
};
