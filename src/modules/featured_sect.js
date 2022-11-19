import { getMedia, QUERIES_AND_VARIABLES } from './gql';

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
  const section = `
    <div class="${sectName} results-container w-full featured-sect relative bottom-6">
      <h1 class="sect-title">${sectTitle}</h1>
      <div class="media-wrapper"></div>
    </div>
    `;

  mainSection.insertAdjacentHTML('beforeend', section);
  const sectWrapper = document.querySelector(`.${sectName} .media-wrapper`);
  return sectWrapper;
};

const createMediaCard = function (media) {
  const mediaCard = `<div class="media-card cursor-pointer relative max-w-[144px] md:max-w-[185px] h-fit rounded-md" data-video_id =${
    media.trailer?.id
  } data-media_id=${media.id}>
    <div class="cover w-full cursor-pointer rounded-md overflow-hidden z-10 inline-block"
      ><img
      class="w-full h-[202.54px] md:h-[265px] object-cover" src="${
        media.coverImage.extraLarge
      }" alt=""/>
    </div>
    <a href="" class="title text-[0.8rem] md:text-[0.9rem] pt-1 inline-block w-[140px] md:w-[180px] overflow-hidden text-ellipsis">${
      media.title?.english || media.title?.romaji || media.title?.native
    }</a>
    <div class="details-overlay rounded-md bg-[var(--overlay-grey)] opacity-0 absolute h-[202.54px] md:h-[265px] w-full left-0 top-0">
    <div class="trailer-container relative w-full overflow-hidden pt-[56.25%]">
      <iframe
      class="trailer absolute top-0 left-0 right-0 bottom-0 w-full h-full cursor-pointer pointer-events-none"
      src=""
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    </div>
  </div>
  </div>
    `;
  return mediaCard;
};

const createFeaturedSect = function (sectName, sectTitle, cb) {
  const sectWrapper = createSeaction(sectName, sectTitle);
  cb().then(result => {
    result.forEach(anime => {
      const card = createMediaCard(anime);
      sectWrapper.insertAdjacentHTML('beforeend', card);
    });

    let timeoutId = null;
    const mediaCards = document.querySelectorAll(`.${sectName} .media-card`);
    mediaCards.forEach(card => {
      card.addEventListener('mouseover', function () {
        timeoutId = setTimeout(function () {
          showdets_basic.call(card);
        }, 500);
      });

      card.addEventListener('mouseleave', function () {
        hidedets_basic.call(card);
      });

      // cancel function if mouse leaves card before 0.5s
      card.addEventListener('mouseout', function () {
        clearTimeout(timeoutId);
      });
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

function isNearEdge(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.left <= 100 ||
    rect.right >=
      (window.innerWidth - 100 || document.documentElement.clientWidth - 100)
  );
}

function transDir(el) {
  const xCoordinate = el.getBoundingClientRect().x;
  // determine what side of viewport the element is in
  return xCoordinate < window.innerWidth / 2 ? '120px' : '-120px';
}

// funcion shows basic anime details when mouse is hovered over
function showdets_basic() {
  this.style.transform = 'scale(1.7)';
  this.style.zIndex = 999;
  if (isNearEdge(this)) this.style.translate = transDir(this);
  this.querySelector('.cover').style.opacity = 0;
  this.querySelector('.title').style.opacity = 0;
  this.querySelector('.details-overlay').style.opacity = 1;
  const trailer = this.querySelector('iframe.trailer');
  trailer.classList.toggle('pointer-events-none');
  if (trailer.src === window.location.href) {
    setTimeout(() => {
      trailer.src = `https://www.youtube-nocookie.com/embed/${this.dataset.video_id}?controls=0`;
    }, 100);
  }
}

// function negates the effect of showdetails_basic()
function hidedets_basic() {
  const trailer = this.querySelector('iframe.trailer');
  trailer.src = ``;
  this.style.transform = 'scale(1)';
  this.style.zIndex = 1;
  trailer.classList.toggle('pointer-events-none');
  this.querySelector('.cover').style.opacity = 1;
  this.querySelector('.title').style.opacity = 1;
  this.style.translate = '0';
  this.querySelector('.details-overlay').style.opacity = 0;
}
