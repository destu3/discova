// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';
// import styles bundle
import 'swiper/css/bundle';

// contains functionality realated to featured section on landing page

function getSeason() {
  const date = new Date();
  const month = date.getMonth() + 1;
  let season = 'winter';

  if (month >= 10 && month <= 12) {
    season = 'fall';
  } else if (month >= 4 && month <= 6) {
    season = 'spring';
  } else if (month >= 7 && month <= 9) {
    season = 'summer';
  }
  return season;
}

function getNextSeason(season) {
  if (season === 'winter') {
    return 'spring';
  } else if (season === 'spring') {
    return 'summer';
  } else if (season === 'summer') {
    return 'fall';
  } else {
    return 'winter';
  }
}

const getTrending = async function () {
  const res = await fetch('https://kitsu.io/api/edge/trending/anime?limit=20&');
  const data = await res.json();
  return data;
};

const getPopular = async function () {
  const res = await fetch(
    'https://kitsu.io/api/edge/anime?page[limit]=20&sort=popularityRank'
  );
  const data = await res.json();
  return data;
};

const getUpcoming = async function () {
  const res = await fetch(
    `https://kitsu.io/api/edge/anime?page[limit]=20&filter[status]=unreleased&filter[status]=upcoming`
  );
  const data = await res.json();
  return data;
};

const getPopularRn = async function () {
  const date = new Date();
  const res = await fetch(
    `https://kitsu.io/api/edge/anime?page[limit]=20&filter[season]=${getSeason()}&filter[seasonYear]=${date.getFullYear()}&sort=-averageRating`
  );
  const data = await res.json();
  return data;
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

const createMediaCard = function (media) {
  const mediaCard = `<div class="swiper-slide max-w-[144px] md:max-w-[185px] h-fit rounded-md media-card" data-media_id=${
    media.id
  }>
    <div class="cover w-full cursor-pointer rounded-md overflow-hidden z-10 inline-block"
      ><img
      class="w-full h-[202.54px] md:h-[265px] object-cover" src="${
        media.attributes.posterImage.large
      }" alt=""/>
    </div>
    <a href="" class="title text-[0.8rem] md:text-[0.9rem] pt-1 inline-block w-[140px] md:w-[180px] overflow-hidden text-ellipsis">${
      media.attributes.titles.en ||
      media.attributes.titles.en_jp ||
      media.attributes.titles.ja_jp
    }</a>
  </div>
    `;
  return mediaCard;
};

const createFeaturedSect = function (sectName, sectTitle, cb) {
  // swiper slider configuration
  let swiper = new Swiper(`.${sectName}.mySwiper`, {
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    speed: '',
    slidesPerGroupAuto: true,
    spaceBetween: 20,
    on: {
      transitionStart: function () {
        document
          .querySelectorAll('.swiper-wrapper')
          .forEach(wrapper => (wrapper.style.transitionDuration = '1250ms'));
      },
      init: function () {
        document
          .querySelectorAll('.swiper-wrapper')
          .forEach(wrapper => (wrapper.style.transitionDuration = '500ms '));
      },
      transitionEnd: function () {
        document
          .querySelectorAll('.swiper-wrapper')
          .forEach(wrapper => (wrapper.style.transitionDuration = '500ms '));
      },
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });

  const sectWrapper = createSeaction(sectName, sectTitle);
  cb().then(result => {
    result.data.forEach(anime => {
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

      card.addEventListener('mouseout', function () {
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
  createFeaturedSect('popular', 'All time Greats', getPopular);
};

export const createUpcoming = function () {
  createFeaturedSect('upcoming', 'Coming soon', getUpcoming);
};

const getTransX = function (wrapper) {
  const translatedX = wrapper.style.transform
    .replace('translate3d', '')
    .replace(/\(|\)/g, '')
    .split(',')[0]
    .replace('px', '');
  return translatedX;
};

// funcion shows basic anime details when mouse is hovered over

function showdets_basic(wrapper) {
  const sect = wrapper.parentElement.classList[0];
  const swiper = document.querySelector(`.${sect}.swiper`).swiper;

  const translatedX = getTransX(wrapper);
  if (this === wrapper.firstElementChild) {
    swiper.setTranslate(50);
    console.log(swiper.translate);
  }

  if (this === wrapper.lastElementChild) {
    swiper.setTranslate(Number(translatedX) - 50);
    console.log(swiper.translate);
  }

  this.style.transform = 'scale(1.55)';
  this.style.zIndex = 999;
}

// function negates the effect of showdetails_basic()
function hidedets_basic(wrapper) {
  const sect = wrapper.parentElement.classList[0];
  const swiper = document.querySelector(`.${sect}.swiper`).swiper;

  if (this === wrapper.firstElementChild) {
    swiper.slideToClosest(1250);
    console.log(swiper.translate);
  }

  if (this === wrapper.lastElementChild) {
    swiper.slideToClosest(1250);
    console.log(swiper.translate);
  }

  this.style.transform = 'scale(1)';
  this.style.zIndex = 1;
}
