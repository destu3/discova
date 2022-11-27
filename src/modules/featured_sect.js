import { getMedia, QUERIES_AND_VARIABLES } from './gql';
import { createMediaCard, showdets_basic, hidedets_basic } from './media';

// contains functionality realated to featured sections on landing page

const getTrending = function () {
  return getMedia(
    QUERIES_AND_VARIABLES.trending.query,
    QUERIES_AND_VARIABLES.trending.variable
  );
};

const getPopularRn = async function () {
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
    <section class="${sectName} results-container w-full featured-sect relative bottom-6 mt-10 sm:px-0">
      <div class=" section-header pb-[20px] flex justify-between items-center">
        <h2 class="sect-title">${sectTitle}</h2>
        <a class=" text-[var(--main-brand)] text-xs font-light cursor-pointer">View more</a>
      </div>
      <div class="media-wrapper"></div>
    </section>
    `;
  mainSection.insertAdjacentHTML('beforeend', section);
  const sectWrapper = document.querySelector(`.${sectName} .media-wrapper`);
  return sectWrapper;
};

const createFeaturedSect = function (sectName, sectTitle, cb) {
  const sectWrapper = createSeaction(sectName, sectTitle);
  cb().then(result => {
    result.forEach(anime => {
      const card = createMediaCard(anime);
      sectWrapper.insertAdjacentHTML('beforeend', card);
    });

    sectWrapper.childNodes.forEach(child => {
      if (child.nodeName !== 'DIV') sectWrapper.removeChild(child);
    });

    let timeoutId = null;
    const mediaCards = document.querySelectorAll(`.${sectName} .media-card`);
    mediaCards.forEach(card => {
      card.addEventListener('mouseenter', function () {
        timeoutId = setTimeout(function () {
          showdets_basic.call(card);
        }, 600);
      });

      card.addEventListener('mouseleave', function () {
        clearTimeout(timeoutId);
        hidedets_basic.call(card);
      });
      // cancel function if mouse leaves card before 0.6s
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
