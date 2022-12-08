import { getMedia, QUERIES_AND_VARIABLES } from './gql';
import { createMediaCard, showdets_basic, hidedets_basic } from './media';
import { createSkeletonCard } from './skeleton';
import { removeAllChildNodes } from './results';
import { showInfo } from './overlay';

// gets trending anime data
const getTrending = function () {
  return getMedia(
    QUERIES_AND_VARIABLES.trending.query,
    QUERIES_AND_VARIABLES.trending.variable
  );
};

// gets anime data for popular shows (current season)
const getPopularRn = async function () {
  return getMedia(
    QUERIES_AND_VARIABLES.popularAiring.query,
    QUERIES_AND_VARIABLES.popularAiring.variable
  );
};

// gets anime data for highly anticipated anime
const getUpcoming = function () {
  return getMedia(
    QUERIES_AND_VARIABLES.popularNextSeason.query,
    QUERIES_AND_VARIABLES.popularNextSeason.variable
  );
};

// gets anime data for popular shows (all time)
const getPopular = function () {
  return getMedia(
    QUERIES_AND_VARIABLES.allTimePopular.query,
    QUERIES_AND_VARIABLES.allTimePopular.variable
  );
};

// creates a featured section component
const createSeaction = function (sectName, sectTitle) {
  const mainSection = document.querySelector('main');
  const section = `
  <section
      class="${sectName} results-container w-full featured-sect relative bottom-6 mt-10 sm:px-0"
    >
      <div class="section-header pb-[20px] flex justify-between items-center">
        <h2 class="sect-title">${sectTitle}</h2>
        <a class="text-[var(--main-brand)] text-xs font-light cursor-pointer"
          >View more</a
        >
      </div>
      <div class="media-wrapper relative"></div>
    </section>
    `;
  mainSection.insertAdjacentHTML('beforeend', section);
  const sectWrapper = document.querySelector(`.${sectName} .media-wrapper`);
  for (let i = 0; i <= 6; i++) {
    sectWrapper.insertAdjacentHTML('beforeend', createSkeletonCard());
  }

  return sectWrapper;
};

// adds event listeners to media cards
export const addCardEventListeners = function (mediaCards) {
  let timeoutId = null;

  mediaCards.forEach(card => {
    const moreDets = card.querySelector('.more-dets');
    moreDets.addEventListener('click', function () {
      showInfo.call(card);
      hidedets_basic.call(card);
    });

    if (!window.matchMedia('(pointer: coarse)').matches) {
      // touchscreen
      card.addEventListener('mouseenter', function (e) {
        timeoutId = setTimeout(function () {
          showdets_basic.call(card);
        }, 600);
      });
    }

    card.addEventListener('click', function (e) {
      if (
        e.target.classList.contains('poster') ||
        e.target.classList.contains('title')
      ) {
        showInfo.call(card);
        console.log(card);
        hidedets_basic.call(card);
      }
    });

    if (!window.matchMedia('(pointer: coarse)').matches) {
      // touchscreen
      // cancel function if mouse leaves card before 0.6s
      card.addEventListener('mouseleave', function () {
        clearTimeout(timeoutId);
        hidedets_basic.call(card);
      });
    }
  });
};

// removes elements from a section if they are not a "div"
export const onlyDivs = function (sectWrapper) {
  sectWrapper.childNodes.forEach(child => {
    if (child.nodeName !== 'DIV') sectWrapper.removeChild(child);
  });
};

// renders a featured section component and adds media cards to it
const createFeaturedSect = function (sectName, sectTitle, cb) {
  const sectWrapper = createSeaction(sectName, sectTitle);
  cb().then(result => {
    removeAllChildNodes(sectWrapper, 'skeleton-card');
    result.forEach(anime => {
      const card = createMediaCard(anime);
      sectWrapper.insertAdjacentHTML('beforeend', card);
    });
    onlyDivs(sectWrapper);
    const mediaCards = document.querySelectorAll(`.${sectName} .media-card`);
    addCardEventListeners(mediaCards);
  });
};

// creates "Trending" section
export const createTrending = function () {
  createFeaturedSect('trending', 'Trending', getTrending);
};

// creates "Popular this season" section
export const createPopularRn = function () {
  createFeaturedSect(
    'popular-this-season',
    'Popular this season',
    getPopularRn
  );
};

// creates "All time popular" section
export const createPopular = function () {
  createFeaturedSect('popular', 'All time popular', getPopular);
};

// creates "Upcoming next season" section
export const createUpcoming = function () {
  createFeaturedSect('upcoming', 'Upcoming next season', getUpcoming);
};
