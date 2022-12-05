import { getMedia, QUERIES_AND_VARIABLES } from './gql';
import {
  createMediaCard,
  showdets_basic,
  hidedets_basic,
  showInfo,
} from './media';
import { createSkeletonCard } from './skeleton';
import { removeAllChildNodes } from './results';

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

const createFeaturedSect = function (sectName, sectTitle, cb) {
  const sectWrapper = createSeaction(sectName, sectTitle);
  cb().then(result => {
    removeAllChildNodes(sectWrapper, 'skeleton-card');
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
      const moreDets = card.querySelector('.more-dets');

      if (!window.matchMedia('(pointer: coarse)').matches) {
        // touchscreen
        card.addEventListener('mouseenter', function (e) {
          timeoutId = setTimeout(function () {
            showdets_basic.call(card);
          }, 600);
        });
      }

      moreDets.addEventListener('click', function () {
        showInfo.call(card);
        hidedets_basic.call(card);
      });

      card.addEventListener('click', function (e) {
        if (
          e.target.classList.contains('poster') ||
          e.target.classList.contains('title')
        ) {
          showInfo.call(card);
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
