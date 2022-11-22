/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/featured_sect.js":
/*!**************************************!*\
  !*** ./src/modules/featured_sect.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPopular": () => (/* binding */ createPopular),
/* harmony export */   "createPopularRn": () => (/* binding */ createPopularRn),
/* harmony export */   "createTrending": () => (/* binding */ createTrending),
/* harmony export */   "createUpcoming": () => (/* binding */ createUpcoming)
/* harmony export */ });
/* harmony import */ var _gql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gql */ "./src/modules/gql.js");
/* harmony import */ var _media__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./media */ "./src/modules/media.js");



// contains functionality realated to featured sections on landing page

const getTrending = function () {
  return (0,_gql__WEBPACK_IMPORTED_MODULE_0__.getMedia)(
    _gql__WEBPACK_IMPORTED_MODULE_0__.QUERIES_AND_VARIABLES.trending.query,
    _gql__WEBPACK_IMPORTED_MODULE_0__.QUERIES_AND_VARIABLES.trending.variable
  );
};

const getPopularRn = function () {
  return (0,_gql__WEBPACK_IMPORTED_MODULE_0__.getMedia)(
    _gql__WEBPACK_IMPORTED_MODULE_0__.QUERIES_AND_VARIABLES.popularAiring.query,
    _gql__WEBPACK_IMPORTED_MODULE_0__.QUERIES_AND_VARIABLES.popularAiring.variable
  );
};

const getUpcoming = function () {
  return (0,_gql__WEBPACK_IMPORTED_MODULE_0__.getMedia)(
    _gql__WEBPACK_IMPORTED_MODULE_0__.QUERIES_AND_VARIABLES.popularNextSeason.query,
    _gql__WEBPACK_IMPORTED_MODULE_0__.QUERIES_AND_VARIABLES.popularNextSeason.variable
  );
};

const getPopular = function () {
  return (0,_gql__WEBPACK_IMPORTED_MODULE_0__.getMedia)(
    _gql__WEBPACK_IMPORTED_MODULE_0__.QUERIES_AND_VARIABLES.allTimePopular.query,
    _gql__WEBPACK_IMPORTED_MODULE_0__.QUERIES_AND_VARIABLES.allTimePopular.variable
  );
};

const createSeaction = function (sectName, sectTitle) {
  const mainSection = document.querySelector('main');
  const section = `
    <section class="${sectName} results-container w-full featured-sect relative bottom-6 mt-10">

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
      const card = (0,_media__WEBPACK_IMPORTED_MODULE_1__.createMediaCard)(anime);
      sectWrapper.insertAdjacentHTML('beforeend', card);
    });

    let timeoutId = null;
    const mediaCards = document.querySelectorAll(`.${sectName} .media-card`);
    mediaCards.forEach(card => {
      card.addEventListener('mouseenter', function (e) {
        timeoutId = setTimeout(function () {
          _media__WEBPACK_IMPORTED_MODULE_1__.showdets_basic.call(card);
        }, 400);
      });

      card.addEventListener('mouseleave', function () {
        clearTimeout(timeoutId);
        _media__WEBPACK_IMPORTED_MODULE_1__.hidedets_basic.call(card);
      });
      // cancel function if mouse leaves card before 0.5s
    });
  });
};

const createTrending = function () {
  createFeaturedSect('trending', 'Trending', getTrending);
};

const createPopularRn = function () {
  createFeaturedSect(
    'popular-this-season',
    'Popular this season',
    getPopularRn
  );
};

const createPopular = function () {
  createFeaturedSect('popular', 'All time popular', getPopular);
};

const createUpcoming = function () {
  createFeaturedSect('upcoming', 'Upcoming next season', getUpcoming);
};


/***/ }),

/***/ "./src/modules/gql.js":
/*!****************************!*\
  !*** ./src/modules/gql.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "QUERIES_AND_VARIABLES": () => (/* binding */ QUERIES_AND_VARIABLES),
/* harmony export */   "getMedia": () => (/* binding */ getMedia)
/* harmony export */ });
// config for gql api requests
const DEFAULT_FIELDS = `id
  title {
    romaji
    english
    native
  }
  type
  genres
  startDate {
    year
    month
    day
  }
  endDate {
    year
    month
    day
  }
  source
  season
  seasonYear
  format
  status
  episodes
  trending
  trailer {
    id
    site
  }
  bannerImage
  coverImage {
    extraLarge
    large
    color
  }
  description
  averageScore
  popularity
  duration
  nextAiringEpisode{
    airingAt
    timeUntilAiring
    episode
  }`;

function getYear() {
  const date = new Date();
  return date.getFullYear();
}

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
  return season.toUpperCase();
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

const QUERIES_AND_VARIABLES = {
  popularAiring: {
    query: `query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            perPage
          }
          media(type: ANIME, season: ${getSeason()}, seasonYear: ${getYear()}, sort: POPULARITY_DESC) {
            ${DEFAULT_FIELDS}
          }
        }
      }
      `,
    variable: {
      page: 1,
      perPage: 7,
    },
  },
  popularNextSeason: {
    query: `query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          total
          perPage
        }
        media(type: ANIME, status: NOT_YET_RELEASED, season: ${getNextSeason(
          getSeason()
        ).toUpperCase()}, sort: POPULARITY_DESC) {
          ${DEFAULT_FIELDS}
        }
      }
    }
    `,
    variable: {
      page: 1,
      perPage: 7,
    },
  },
  allTimePopular: {
    query: `query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            perPage
          }
          media(type: ANIME, sort: POPULARITY_DESC) {
            ${DEFAULT_FIELDS}
          }
        }
      }
      `,
    variable: {
      page: 1,
      perPage: 7,
    },
  },
  trending: {
    query: `query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            perPage
          }
          media(type: ANIME, sort: TRENDING_DESC) {
            ${DEFAULT_FIELDS}
          }
        }
      }
      `,
    variable: {
      page: 1,
      perPage: 7,
    },
  },
};

async function getMedia(query, variables) {
  let _query = query;

  // Define our query variables and values that will be used in the query request
  let _variables = variables;

  // Define the config we'll need for our Api request
  let url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: _query,
        variables: _variables,
      }),
      mode: 'cors',
    };

  let response = await fetch(url, options);
  let data = await response.json();
  return data.data.Page.media;
}


/***/ }),

/***/ "./src/modules/media.js":
/*!******************************!*\
  !*** ./src/modules/media.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createMediaCard": () => (/* binding */ createMediaCard),
/* harmony export */   "hidedets_basic": () => (/* binding */ hidedets_basic),
/* harmony export */   "showdets_basic": () => (/* binding */ showdets_basic)
/* harmony export */ });
// creates card component for an anime
function determineEps(media) {
  if (media.status === 'FINISHED') {
    return `Episode ${media.episodes} aired on`;
  } else if (media?.nextAiringEpisode && media?.episodes) {
    return `Episode ${media.nextAiringEpisode.episode} of ${media.episodes} airing in  `;
  } else if (media?.nextAiringEpisode) {
    return `Episode ${media.nextAiringEpisode.episode} airing in  `;
  } else if (media.status === 'NOT_YET_RELEASED') {
    return `Airing in ${
      media.season.charAt(0).toUpperCase() + media.season.slice(1).toLowerCase()
    } ${media.seasonYear}`;
  }
}

function determineIcon(rating) {
  if (rating === null) {
    return 'fa-face-dizzy text-[var(--heading-grey)]';
  } else if (rating > 0 && rating < 65) {
    return 'fa-face-frown text-[#CF6679]';
  } else if (rating >= 65 && rating < 75) {
    return 'fa-face-meh text-[#FF7A3C]';
  } else {
    return 'fa-face-smile text-[#7BD555]';
  }
}

function toDaysMinutesSeconds(totalSeconds) {
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const days = Math.floor(totalSeconds / (3600 * 24));

  const minutesStr = makeHumanReadable(minutes, 'min');
  const hoursStr = makeHumanReadable(hours, 'hr');
  const daysStr = makeHumanReadable(days, 'day');

  return `${daysStr}${hoursStr}${minutesStr}`.replace(/,\s*$/, '');
}

function makeHumanReadable(num, singular) {
  return num > 0
    ? num + (num === 1 ? ` ${singular}, ` : ` ${singular}s, `)
    : '';
}

function formatSource(source) {
  if (source.includes('_')) {
    const formatted = source
      .replace('_', ' ')
      .split(' ')
      .map(
        string => string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
      )
      .join(' ');
    return formatted;
  } else {
    return source.charAt(0).toUpperCase() + source.slice(1).toLowerCase();
  }
}

function createGenreTag(genre) {
  return `<div class="genre text-center rounded-[10px] font-medium text-[0.4rem] pl-[2px] text-[var(--main-brand)]">${genre}</div>`;
}

function displayCountdown(media) {
  if (media.status === 'NOT_YET_RELEASED') {
    return media.seasonYear;
  } else if (media.status === 'FINISHED') {
    return `${media.endDate.day}/${media.endDate.month}/${media.endDate.year}`;
  } else if (media.status === 'RELEASING') {
    return toDaysMinutesSeconds(media.nextAiringEpisode.timeUntilAiring);
  }
}

const createMediaCard = function (media) {
  const genres = media.genres.slice(0, 3);
  const mediaCard = `<div class="media-card cursor-pointer relative max-w-[144px] md:max-w-[185px] h-fit rounded-md" data-video_id =${
    media.trailer?.id
  } data-media_id=${media.id}>
      <div class="cover w-full cursor-pointer rounded-md relative overflow-hidden inline-block"
        ><img
        class="w-full h-[202.54px] md:h-[265px] relative object-cover" src="${
          media.coverImage.extraLarge
        }" alt=""/>
      </div>
      <a href="" class="title text-[0.8rem] md:text-[0.9rem] pt-1 inline-block w-[140px] md:w-[180px] overflow-hidden text-ellipsis">${
        media.title?.english || media.title?.romaji || media.title?.native
      }</a>
      <div class="details-overlay overflow-hidden rounded-md bg-[var(--overlay-grey)] opacity-0 absolute w-full left-0 top-[50px]">
      <div class="trailer-container relative w-full overflow-hidden pt-[56.25%]">
        <iframe
        class="trailer absolute top-0 left-0 right-0 bottom-0 w-full h-full rounded-t-md"
        src=""
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      </div>
      <div class="basic-dets w-full relative p-[6px]">
      <div class="avg-score absolute right-2 top-[5px] text-[0.475rem]">
        <i class="fa-regular ${determineIcon(media.averageScore)}"></i>
        <span class="score-value text-[var(--main-text)]">${
          media.averageScore !== null ? media.averageScore + '%' : 'NA'
        }</span>
      </div>
      <div class="basic-dets-episodes font-medium text-[0.45rem] text-[var(--main-brand)]">
        ${determineEps(media)}
      </div>
      <div
        class="basic-dets-countdown text-[0.45rem] pb-[1px] text-[var(--heading-grey)] font-medium"
      >
        ${displayCountdown(media)}
      </div>
      <div
        class="basic-dets-source text-[0.4rem] font-medium text-[var(--main-text)] mb-1"
      >
        Source • ${formatSource(media.source)}
      </div>
      <p
        class="basic-dets-synopsis text-[var(--main-text)] text-[0.4rem] font-medium mb-6"
      >
       ${media.description}
      </p>
      <div
        class="genres flex justify-center items-center gap-1 pl-1 absolute pb-2 bottom-0 left-0"
      >
      ${genres.map(genre => createGenreTag(genre)).join('')}
      </div>
    </div>
    </div>
    </div>
      `;
  return mediaCard;
};

function isNearEdge(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.left < 110 ||
    rect.right >
      (window.innerWidth - 110 || document.documentElement.clientWidth - 110)
  );
}

function transDir(el) {
  const xCoordinate = el.getBoundingClientRect().x;
  // determine what side of viewport the element is in
  return xCoordinate < window.innerWidth / 2 ? '150px' : '-150px';
}

// funcion shows basic anime details when mouse is hovered over
function showdets_basic() {
  const trailer = this.querySelector('iframe.trailer');
  this.style.zIndex = 999;
  this.style.transform = 'scale(2.4)';
  this.querySelector('.cover').style.transform = 'scale(0)';
  this.querySelector('.cover').style.opacity = 0;
  this.querySelector('.title').style.opacity = '0';
  this.querySelector('.details-overlay').style.opacity = 1;
  if (isNearEdge(this)) this.style.translate = transDir(this);
  if (trailer.src === window.location.href) {
    setTimeout(() => {
      trailer.src = `https://www.youtube-nocookie.com/embed/${this.dataset.video_id}?controls=0`;
    }, 200);
  }
}

// function negates the effect of showdetails_basic()
function hidedets_basic() {
  const trailer = this.querySelector('iframe.trailer');
  this.querySelector('.details-overlay').style.opacity = 0;
  this.querySelector('.cover').style.opacity = 1;
  trailer.src = ``;
  this.querySelector('.cover').style.transform = 'scale(1)';
  this.style.transform = 'scale(1)';
  this.style.translate = '0';
  setTimeout(() => {
    this.style.zIndex = 1;
    this.querySelector('.title').style.opacity = '1';
  }, 100);
}


/***/ }),

/***/ "./src/modules/nav.js":
/*!****************************!*\
  !*** ./src/modules/nav.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "hideSrchBar": () => (/* binding */ hideSrchBar),
/* harmony export */   "showSrchBar": () => (/* binding */ showSrchBar)
/* harmony export */ });
// contains functinality related to the navbar

const showSrchBar = function (searchBtn, searchBar) {
  searchBar.classList.add('_visible');
  searchBtn.classList.add('_hidden');
};

const hideSrchBar = function (searchBtn, searchBar) {
  searchBar.classList.remove('_visible');
  searchBtn.classList.remove('_hidden');
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_nav__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/nav */ "./src/modules/nav.js");
/* harmony import */ var _modules_featured_sect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/featured_sect */ "./src/modules/featured_sect.js");



// Dom selection
const srchBtn = document.querySelector('.search-btn');
const srchBar = document.querySelector('.search-bar');
const hideSrchBarBtn = document.querySelector('.hide-search-bar');

// event listners
document.addEventListener('DOMContentLoaded', () => {
  (0,_modules_featured_sect__WEBPACK_IMPORTED_MODULE_1__.createTrending)();
  (0,_modules_featured_sect__WEBPACK_IMPORTED_MODULE_1__.createPopularRn)();
  (0,_modules_featured_sect__WEBPACK_IMPORTED_MODULE_1__.createUpcoming)();
  (0,_modules_featured_sect__WEBPACK_IMPORTED_MODULE_1__.createPopular)();
});

srchBtn.addEventListener('click', () => {
  (0,_modules_nav__WEBPACK_IMPORTED_MODULE_0__.showSrchBar)(srchBtn, srchBar);
});

hideSrchBarBtn.addEventListener('click', () => {
  (0,_modules_nav__WEBPACK_IMPORTED_MODULE_0__.hideSrchBar)(srchBtn, srchBar);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEVBQUUscUVBQWE7QUFDZixDQUFDO0FBQ0Q7QUFDQTtBQUNBLEVBQUUseURBQVc7QUFDYixDQUFDO0FBQ0Q7QUFDQTtBQUNBLEVBQUUseURBQVc7QUFDYixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZGlzY292YS8uL3NyYy9tb2R1bGVzL2ZlYXR1cmVkX3NlY3QuanMiLCJ3ZWJwYWNrOi8vZGlzY292YS8uL3NyYy9tb2R1bGVzL2dxbC5qcyIsIndlYnBhY2s6Ly9kaXNjb3ZhLy4vc3JjL21vZHVsZXMvbWVkaWEuanMiLCJ3ZWJwYWNrOi8vZGlzY292YS8uL3NyYy9tb2R1bGVzL25hdi5qcyIsIndlYnBhY2s6Ly9kaXNjb3ZhL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2Rpc2NvdmEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2Rpc2NvdmEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kaXNjb3ZhL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZGlzY292YS8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBnZXRNZWRpYSwgUVVFUklFU19BTkRfVkFSSUFCTEVTIH0gZnJvbSAnLi9ncWwnO1xyXG5pbXBvcnQgeyBjcmVhdGVNZWRpYUNhcmQsIHNob3dkZXRzX2Jhc2ljLCBoaWRlZGV0c19iYXNpYyB9IGZyb20gJy4vbWVkaWEnO1xyXG5cclxuLy8gY29udGFpbnMgZnVuY3Rpb25hbGl0eSByZWFsYXRlZCB0byBmZWF0dXJlZCBzZWN0aW9ucyBvbiBsYW5kaW5nIHBhZ2VcclxuXHJcbmNvbnN0IGdldFRyZW5kaW5nID0gZnVuY3Rpb24gKCkge1xyXG4gIHJldHVybiBnZXRNZWRpYShcclxuICAgIFFVRVJJRVNfQU5EX1ZBUklBQkxFUy50cmVuZGluZy5xdWVyeSxcclxuICAgIFFVRVJJRVNfQU5EX1ZBUklBQkxFUy50cmVuZGluZy52YXJpYWJsZVxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRQb3B1bGFyUm4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgcmV0dXJuIGdldE1lZGlhKFxyXG4gICAgUVVFUklFU19BTkRfVkFSSUFCTEVTLnBvcHVsYXJBaXJpbmcucXVlcnksXHJcbiAgICBRVUVSSUVTX0FORF9WQVJJQUJMRVMucG9wdWxhckFpcmluZy52YXJpYWJsZVxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBnZXRVcGNvbWluZyA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZ2V0TWVkaWEoXHJcbiAgICBRVUVSSUVTX0FORF9WQVJJQUJMRVMucG9wdWxhck5leHRTZWFzb24ucXVlcnksXHJcbiAgICBRVUVSSUVTX0FORF9WQVJJQUJMRVMucG9wdWxhck5leHRTZWFzb24udmFyaWFibGVcclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgZ2V0UG9wdWxhciA9IGZ1bmN0aW9uICgpIHtcclxuICByZXR1cm4gZ2V0TWVkaWEoXHJcbiAgICBRVUVSSUVTX0FORF9WQVJJQUJMRVMuYWxsVGltZVBvcHVsYXIucXVlcnksXHJcbiAgICBRVUVSSUVTX0FORF9WQVJJQUJMRVMuYWxsVGltZVBvcHVsYXIudmFyaWFibGVcclxuICApO1xyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlU2VhY3Rpb24gPSBmdW5jdGlvbiAoc2VjdE5hbWUsIHNlY3RUaXRsZSkge1xyXG4gIGNvbnN0IG1haW5TZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWFpbicpO1xyXG4gIGNvbnN0IHNlY3Rpb24gPSBgXHJcbiAgICA8c2VjdGlvbiBjbGFzcz1cIiR7c2VjdE5hbWV9IHJlc3VsdHMtY29udGFpbmVyIHctZnVsbCBmZWF0dXJlZC1zZWN0IHJlbGF0aXZlIGJvdHRvbS02IG10LTEwXCI+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwiIHNlY3Rpb24taGVhZGVyIHBiLVsyMHB4XSBmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8aDIgY2xhc3M9XCJzZWN0LXRpdGxlXCI+JHtzZWN0VGl0bGV9PC9oMj5cclxuICAgICAgICA8YSBjbGFzcz1cIiB0ZXh0LVt2YXIoLS1tYWluLWJyYW5kKV0gdGV4dC14cyBmb250LWxpZ2h0IGN1cnNvci1wb2ludGVyXCI+VmlldyBtb3JlPC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cIm1lZGlhLXdyYXBwZXJcIj48L2Rpdj5cclxuICAgIDwvc2VjdGlvbj5cclxuICAgIGA7XHJcblxyXG4gIG1haW5TZWN0aW9uLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgc2VjdGlvbik7XHJcbiAgY29uc3Qgc2VjdFdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtzZWN0TmFtZX0gLm1lZGlhLXdyYXBwZXJgKTtcclxuICByZXR1cm4gc2VjdFdyYXBwZXI7XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVGZWF0dXJlZFNlY3QgPSBmdW5jdGlvbiAoc2VjdE5hbWUsIHNlY3RUaXRsZSwgY2IpIHtcclxuICBjb25zdCBzZWN0V3JhcHBlciA9IGNyZWF0ZVNlYWN0aW9uKHNlY3ROYW1lLCBzZWN0VGl0bGUpO1xyXG4gIGNiKCkudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgcmVzdWx0LmZvckVhY2goYW5pbWUgPT4ge1xyXG4gICAgICBjb25zdCBjYXJkID0gY3JlYXRlTWVkaWFDYXJkKGFuaW1lKTtcclxuICAgICAgc2VjdFdyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBjYXJkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCB0aW1lb3V0SWQgPSBudWxsO1xyXG4gICAgY29uc3QgbWVkaWFDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3NlY3ROYW1lfSAubWVkaWEtY2FyZGApO1xyXG4gICAgbWVkaWFDYXJkcy5mb3JFYWNoKGNhcmQgPT4ge1xyXG4gICAgICBjYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgc2hvd2RldHNfYmFzaWMuY2FsbChjYXJkKTtcclxuICAgICAgICB9LCA0MDApO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGNhcmQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcclxuICAgICAgICBoaWRlZGV0c19iYXNpYy5jYWxsKGNhcmQpO1xyXG4gICAgICB9KTtcclxuICAgICAgLy8gY2FuY2VsIGZ1bmN0aW9uIGlmIG1vdXNlIGxlYXZlcyBjYXJkIGJlZm9yZSAwLjVzXHJcbiAgICB9KTtcclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVUcmVuZGluZyA9IGZ1bmN0aW9uICgpIHtcclxuICBjcmVhdGVGZWF0dXJlZFNlY3QoJ3RyZW5kaW5nJywgJ1RyZW5kaW5nJywgZ2V0VHJlbmRpbmcpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBvcHVsYXJSbiA9IGZ1bmN0aW9uICgpIHtcclxuICBjcmVhdGVGZWF0dXJlZFNlY3QoXHJcbiAgICAncG9wdWxhci10aGlzLXNlYXNvbicsXHJcbiAgICAnUG9wdWxhciB0aGlzIHNlYXNvbicsXHJcbiAgICBnZXRQb3B1bGFyUm5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVBvcHVsYXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgY3JlYXRlRmVhdHVyZWRTZWN0KCdwb3B1bGFyJywgJ0FsbCB0aW1lIHBvcHVsYXInLCBnZXRQb3B1bGFyKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVVcGNvbWluZyA9IGZ1bmN0aW9uICgpIHtcclxuICBjcmVhdGVGZWF0dXJlZFNlY3QoJ3VwY29taW5nJywgJ1VwY29taW5nIG5leHQgc2Vhc29uJywgZ2V0VXBjb21pbmcpO1xyXG59O1xyXG4iLCIvLyBjb25maWcgZm9yIGdxbCBhcGkgcmVxdWVzdHNcclxuY29uc3QgREVGQVVMVF9GSUVMRFMgPSBgaWRcclxuICB0aXRsZSB7XHJcbiAgICByb21hamlcclxuICAgIGVuZ2xpc2hcclxuICAgIG5hdGl2ZVxyXG4gIH1cclxuICB0eXBlXHJcbiAgZ2VucmVzXHJcbiAgc3RhcnREYXRlIHtcclxuICAgIHllYXJcclxuICAgIG1vbnRoXHJcbiAgICBkYXlcclxuICB9XHJcbiAgZW5kRGF0ZSB7XHJcbiAgICB5ZWFyXHJcbiAgICBtb250aFxyXG4gICAgZGF5XHJcbiAgfVxyXG4gIHNvdXJjZVxyXG4gIHNlYXNvblxyXG4gIHNlYXNvblllYXJcclxuICBmb3JtYXRcclxuICBzdGF0dXNcclxuICBlcGlzb2Rlc1xyXG4gIHRyZW5kaW5nXHJcbiAgdHJhaWxlciB7XHJcbiAgICBpZFxyXG4gICAgc2l0ZVxyXG4gIH1cclxuICBiYW5uZXJJbWFnZVxyXG4gIGNvdmVySW1hZ2Uge1xyXG4gICAgZXh0cmFMYXJnZVxyXG4gICAgbGFyZ2VcclxuICAgIGNvbG9yXHJcbiAgfVxyXG4gIGRlc2NyaXB0aW9uXHJcbiAgYXZlcmFnZVNjb3JlXHJcbiAgcG9wdWxhcml0eVxyXG4gIGR1cmF0aW9uXHJcbiAgbmV4dEFpcmluZ0VwaXNvZGV7XHJcbiAgICBhaXJpbmdBdFxyXG4gICAgdGltZVVudGlsQWlyaW5nXHJcbiAgICBlcGlzb2RlXHJcbiAgfWA7XHJcblxyXG5mdW5jdGlvbiBnZXRZZWFyKCkge1xyXG4gIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gIHJldHVybiBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNlYXNvbigpIHtcclxuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBjb25zdCBtb250aCA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XHJcbiAgbGV0IHNlYXNvbiA9ICd3aW50ZXInO1xyXG5cclxuICBpZiAobW9udGggPj0gMTAgJiYgbW9udGggPD0gMTIpIHtcclxuICAgIHNlYXNvbiA9ICdmYWxsJztcclxuICB9IGVsc2UgaWYgKG1vbnRoID49IDQgJiYgbW9udGggPD0gNikge1xyXG4gICAgc2Vhc29uID0gJ3NwcmluZyc7XHJcbiAgfSBlbHNlIGlmIChtb250aCA+PSA3ICYmIG1vbnRoIDw9IDkpIHtcclxuICAgIHNlYXNvbiA9ICdzdW1tZXInO1xyXG4gIH1cclxuICByZXR1cm4gc2Vhc29uLnRvVXBwZXJDYXNlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE5leHRTZWFzb24oc2Vhc29uKSB7XHJcbiAgaWYgKHNlYXNvbiA9PT0gJ3dpbnRlcicpIHtcclxuICAgIHJldHVybiAnc3ByaW5nJztcclxuICB9IGVsc2UgaWYgKHNlYXNvbiA9PT0gJ3NwcmluZycpIHtcclxuICAgIHJldHVybiAnc3VtbWVyJztcclxuICB9IGVsc2UgaWYgKHNlYXNvbiA9PT0gJ3N1bW1lcicpIHtcclxuICAgIHJldHVybiAnZmFsbCc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnd2ludGVyJztcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBRVUVSSUVTX0FORF9WQVJJQUJMRVMgPSB7XHJcbiAgcG9wdWxhckFpcmluZzoge1xyXG4gICAgcXVlcnk6IGBxdWVyeSAoJHBhZ2U6IEludCwgJHBlclBhZ2U6IEludCkge1xyXG4gICAgICAgIFBhZ2UocGFnZTogJHBhZ2UsIHBlclBhZ2U6ICRwZXJQYWdlKSB7XHJcbiAgICAgICAgICBwYWdlSW5mbyB7XHJcbiAgICAgICAgICAgIHRvdGFsXHJcbiAgICAgICAgICAgIHBlclBhZ2VcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG1lZGlhKHR5cGU6IEFOSU1FLCBzZWFzb246ICR7Z2V0U2Vhc29uKCl9LCBzZWFzb25ZZWFyOiAke2dldFllYXIoKX0sIHNvcnQ6IFBPUFVMQVJJVFlfREVTQykge1xyXG4gICAgICAgICAgICAke0RFRkFVTFRfRklFTERTfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBgLFxyXG4gICAgdmFyaWFibGU6IHtcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgcGVyUGFnZTogNyxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwb3B1bGFyTmV4dFNlYXNvbjoge1xyXG4gICAgcXVlcnk6IGBxdWVyeSAoJHBhZ2U6IEludCwgJHBlclBhZ2U6IEludCkge1xyXG4gICAgICBQYWdlKHBhZ2U6ICRwYWdlLCBwZXJQYWdlOiAkcGVyUGFnZSkge1xyXG4gICAgICAgIHBhZ2VJbmZvIHtcclxuICAgICAgICAgIHRvdGFsXHJcbiAgICAgICAgICBwZXJQYWdlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1lZGlhKHR5cGU6IEFOSU1FLCBzdGF0dXM6IE5PVF9ZRVRfUkVMRUFTRUQsIHNlYXNvbjogJHtnZXROZXh0U2Vhc29uKFxyXG4gICAgICAgICAgZ2V0U2Vhc29uKClcclxuICAgICAgICApLnRvVXBwZXJDYXNlKCl9LCBzb3J0OiBQT1BVTEFSSVRZX0RFU0MpIHtcclxuICAgICAgICAgICR7REVGQVVMVF9GSUVMRFN9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBgLFxyXG4gICAgdmFyaWFibGU6IHtcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgcGVyUGFnZTogNyxcclxuICAgIH0sXHJcbiAgfSxcclxuICBhbGxUaW1lUG9wdWxhcjoge1xyXG4gICAgcXVlcnk6IGBxdWVyeSAoJHBhZ2U6IEludCwgJHBlclBhZ2U6IEludCkge1xyXG4gICAgICAgIFBhZ2UocGFnZTogJHBhZ2UsIHBlclBhZ2U6ICRwZXJQYWdlKSB7XHJcbiAgICAgICAgICBwYWdlSW5mbyB7XHJcbiAgICAgICAgICAgIHRvdGFsXHJcbiAgICAgICAgICAgIHBlclBhZ2VcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG1lZGlhKHR5cGU6IEFOSU1FLCBzb3J0OiBQT1BVTEFSSVRZX0RFU0MpIHtcclxuICAgICAgICAgICAgJHtERUZBVUxUX0ZJRUxEU31cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgYCxcclxuICAgIHZhcmlhYmxlOiB7XHJcbiAgICAgIHBhZ2U6IDEsXHJcbiAgICAgIHBlclBhZ2U6IDcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdHJlbmRpbmc6IHtcclxuICAgIHF1ZXJ5OiBgcXVlcnkgKCRwYWdlOiBJbnQsICRwZXJQYWdlOiBJbnQpIHtcclxuICAgICAgICBQYWdlKHBhZ2U6ICRwYWdlLCBwZXJQYWdlOiAkcGVyUGFnZSkge1xyXG4gICAgICAgICAgcGFnZUluZm8ge1xyXG4gICAgICAgICAgICB0b3RhbFxyXG4gICAgICAgICAgICBwZXJQYWdlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBtZWRpYSh0eXBlOiBBTklNRSwgc29ydDogVFJFTkRJTkdfREVTQykge1xyXG4gICAgICAgICAgICAke0RFRkFVTFRfRklFTERTfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBgLFxyXG4gICAgdmFyaWFibGU6IHtcclxuICAgICAgcGFnZTogMSxcclxuICAgICAgcGVyUGFnZTogNyxcclxuICAgIH0sXHJcbiAgfSxcclxufTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRNZWRpYShxdWVyeSwgdmFyaWFibGVzKSB7XHJcbiAgbGV0IF9xdWVyeSA9IHF1ZXJ5O1xyXG5cclxuICAvLyBEZWZpbmUgb3VyIHF1ZXJ5IHZhcmlhYmxlcyBhbmQgdmFsdWVzIHRoYXQgd2lsbCBiZSB1c2VkIGluIHRoZSBxdWVyeSByZXF1ZXN0XHJcbiAgbGV0IF92YXJpYWJsZXMgPSB2YXJpYWJsZXM7XHJcblxyXG4gIC8vIERlZmluZSB0aGUgY29uZmlnIHdlJ2xsIG5lZWQgZm9yIG91ciBBcGkgcmVxdWVzdFxyXG4gIGxldCB1cmwgPSAnaHR0cHM6Ly9ncmFwaHFsLmFuaWxpc3QuY28nLFxyXG4gICAgb3B0aW9ucyA9IHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICB9LFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgcXVlcnk6IF9xdWVyeSxcclxuICAgICAgICB2YXJpYWJsZXM6IF92YXJpYWJsZXMsXHJcbiAgICAgIH0pLFxyXG4gICAgICBtb2RlOiAnY29ycycsXHJcbiAgICB9O1xyXG5cclxuICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIG9wdGlvbnMpO1xyXG4gIGxldCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gIHJldHVybiBkYXRhLmRhdGEuUGFnZS5tZWRpYTtcclxufVxyXG4iLCIvLyBjcmVhdGVzIGNhcmQgY29tcG9uZW50IGZvciBhbiBhbmltZVxyXG5mdW5jdGlvbiBkZXRlcm1pbmVFcHMobWVkaWEpIHtcclxuICBpZiAobWVkaWEuc3RhdHVzID09PSAnRklOSVNIRUQnKSB7XHJcbiAgICByZXR1cm4gYEVwaXNvZGUgJHttZWRpYS5lcGlzb2Rlc30gYWlyZWQgb25gO1xyXG4gIH0gZWxzZSBpZiAobWVkaWE/Lm5leHRBaXJpbmdFcGlzb2RlICYmIG1lZGlhPy5lcGlzb2Rlcykge1xyXG4gICAgcmV0dXJuIGBFcGlzb2RlICR7bWVkaWEubmV4dEFpcmluZ0VwaXNvZGUuZXBpc29kZX0gb2YgJHttZWRpYS5lcGlzb2Rlc30gYWlyaW5nIGluICBgO1xyXG4gIH0gZWxzZSBpZiAobWVkaWE/Lm5leHRBaXJpbmdFcGlzb2RlKSB7XHJcbiAgICByZXR1cm4gYEVwaXNvZGUgJHttZWRpYS5uZXh0QWlyaW5nRXBpc29kZS5lcGlzb2RlfSBhaXJpbmcgaW4gIGA7XHJcbiAgfSBlbHNlIGlmIChtZWRpYS5zdGF0dXMgPT09ICdOT1RfWUVUX1JFTEVBU0VEJykge1xyXG4gICAgcmV0dXJuIGBBaXJpbmcgaW4gJHtcclxuICAgICAgbWVkaWEuc2Vhc29uLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgbWVkaWEuc2Vhc29uLnNsaWNlKDEpLnRvTG93ZXJDYXNlKClcclxuICAgIH0gJHttZWRpYS5zZWFzb25ZZWFyfWA7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZXRlcm1pbmVJY29uKHJhdGluZykge1xyXG4gIGlmIChyYXRpbmcgPT09IG51bGwpIHtcclxuICAgIHJldHVybiAnZmEtZmFjZS1kaXp6eSB0ZXh0LVt2YXIoLS1oZWFkaW5nLWdyZXkpXSc7XHJcbiAgfSBlbHNlIGlmIChyYXRpbmcgPiAwICYmIHJhdGluZyA8IDY1KSB7XHJcbiAgICByZXR1cm4gJ2ZhLWZhY2UtZnJvd24gdGV4dC1bI0NGNjY3OV0nO1xyXG4gIH0gZWxzZSBpZiAocmF0aW5nID49IDY1ICYmIHJhdGluZyA8IDc1KSB7XHJcbiAgICByZXR1cm4gJ2ZhLWZhY2UtbWVoIHRleHQtWyNGRjdBM0NdJztcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuICdmYS1mYWNlLXNtaWxlIHRleHQtWyM3QkQ1NTVdJztcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvRGF5c01pbnV0ZXNTZWNvbmRzKHRvdGFsU2Vjb25kcykge1xyXG4gIGNvbnN0IHNlY29uZHMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcyAlIDYwKTtcclxuICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcigodG90YWxTZWNvbmRzICUgMzYwMCkgLyA2MCk7XHJcbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKCh0b3RhbFNlY29uZHMgJSAoMzYwMCAqIDI0KSkgLyAzNjAwKTtcclxuICBjb25zdCBkYXlzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyAoMzYwMCAqIDI0KSk7XHJcblxyXG4gIGNvbnN0IG1pbnV0ZXNTdHIgPSBtYWtlSHVtYW5SZWFkYWJsZShtaW51dGVzLCAnbWluJyk7XHJcbiAgY29uc3QgaG91cnNTdHIgPSBtYWtlSHVtYW5SZWFkYWJsZShob3VycywgJ2hyJyk7XHJcbiAgY29uc3QgZGF5c1N0ciA9IG1ha2VIdW1hblJlYWRhYmxlKGRheXMsICdkYXknKTtcclxuXHJcbiAgcmV0dXJuIGAke2RheXNTdHJ9JHtob3Vyc1N0cn0ke21pbnV0ZXNTdHJ9YC5yZXBsYWNlKC8sXFxzKiQvLCAnJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VIdW1hblJlYWRhYmxlKG51bSwgc2luZ3VsYXIpIHtcclxuICByZXR1cm4gbnVtID4gMFxyXG4gICAgPyBudW0gKyAobnVtID09PSAxID8gYCAke3Npbmd1bGFyfSwgYCA6IGAgJHtzaW5ndWxhcn1zLCBgKVxyXG4gICAgOiAnJztcclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0U291cmNlKHNvdXJjZSkge1xyXG4gIGlmIChzb3VyY2UuaW5jbHVkZXMoJ18nKSkge1xyXG4gICAgY29uc3QgZm9ybWF0dGVkID0gc291cmNlXHJcbiAgICAgIC5yZXBsYWNlKCdfJywgJyAnKVxyXG4gICAgICAuc3BsaXQoJyAnKVxyXG4gICAgICAubWFwKFxyXG4gICAgICAgIHN0cmluZyA9PiBzdHJpbmcuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzdHJpbmcuc2xpY2UoMSkudG9Mb3dlckNhc2UoKVxyXG4gICAgICApXHJcbiAgICAgIC5qb2luKCcgJyk7XHJcbiAgICByZXR1cm4gZm9ybWF0dGVkO1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gc291cmNlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc291cmNlLnNsaWNlKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVHZW5yZVRhZyhnZW5yZSkge1xyXG4gIHJldHVybiBgPGRpdiBjbGFzcz1cImdlbnJlIHRleHQtY2VudGVyIHJvdW5kZWQtWzEwcHhdIGZvbnQtbWVkaXVtIHRleHQtWzAuNHJlbV0gcGwtWzJweF0gdGV4dC1bdmFyKC0tbWFpbi1icmFuZCldXCI+JHtnZW5yZX08L2Rpdj5gO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5Q291bnRkb3duKG1lZGlhKSB7XHJcbiAgaWYgKG1lZGlhLnN0YXR1cyA9PT0gJ05PVF9ZRVRfUkVMRUFTRUQnKSB7XHJcbiAgICByZXR1cm4gbWVkaWEuc2Vhc29uWWVhcjtcclxuICB9IGVsc2UgaWYgKG1lZGlhLnN0YXR1cyA9PT0gJ0ZJTklTSEVEJykge1xyXG4gICAgcmV0dXJuIGAke21lZGlhLmVuZERhdGUuZGF5fS8ke21lZGlhLmVuZERhdGUubW9udGh9LyR7bWVkaWEuZW5kRGF0ZS55ZWFyfWA7XHJcbiAgfSBlbHNlIGlmIChtZWRpYS5zdGF0dXMgPT09ICdSRUxFQVNJTkcnKSB7XHJcbiAgICByZXR1cm4gdG9EYXlzTWludXRlc1NlY29uZHMobWVkaWEubmV4dEFpcmluZ0VwaXNvZGUudGltZVVudGlsQWlyaW5nKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVNZWRpYUNhcmQgPSBmdW5jdGlvbiAobWVkaWEpIHtcclxuICBjb25zdCBnZW5yZXMgPSBtZWRpYS5nZW5yZXMuc2xpY2UoMCwgMyk7XHJcbiAgY29uc3QgbWVkaWFDYXJkID0gYDxkaXYgY2xhc3M9XCJtZWRpYS1jYXJkIGN1cnNvci1wb2ludGVyIHJlbGF0aXZlIG1heC13LVsxNDRweF0gbWQ6bWF4LXctWzE4NXB4XSBoLWZpdCByb3VuZGVkLW1kXCIgZGF0YS12aWRlb19pZCA9JHtcclxuICAgIG1lZGlhLnRyYWlsZXI/LmlkXHJcbiAgfSBkYXRhLW1lZGlhX2lkPSR7bWVkaWEuaWR9PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY292ZXIgdy1mdWxsIGN1cnNvci1wb2ludGVyIHJvdW5kZWQtbWQgcmVsYXRpdmUgb3ZlcmZsb3ctaGlkZGVuIGlubGluZS1ibG9ja1wiXHJcbiAgICAgICAgPjxpbWdcclxuICAgICAgICBjbGFzcz1cInctZnVsbCBoLVsyMDIuNTRweF0gbWQ6aC1bMjY1cHhdIHJlbGF0aXZlIG9iamVjdC1jb3ZlclwiIHNyYz1cIiR7XHJcbiAgICAgICAgICBtZWRpYS5jb3ZlckltYWdlLmV4dHJhTGFyZ2VcclxuICAgICAgICB9XCIgYWx0PVwiXCIvPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGEgaHJlZj1cIlwiIGNsYXNzPVwidGl0bGUgdGV4dC1bMC44cmVtXSBtZDp0ZXh0LVswLjlyZW1dIHB0LTEgaW5saW5lLWJsb2NrIHctWzE0MHB4XSBtZDp3LVsxODBweF0gb3ZlcmZsb3ctaGlkZGVuIHRleHQtZWxsaXBzaXNcIj4ke1xyXG4gICAgICAgIG1lZGlhLnRpdGxlPy5lbmdsaXNoIHx8IG1lZGlhLnRpdGxlPy5yb21hamkgfHwgbWVkaWEudGl0bGU/Lm5hdGl2ZVxyXG4gICAgICB9PC9hPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZGV0YWlscy1vdmVybGF5IG92ZXJmbG93LWhpZGRlbiByb3VuZGVkLW1kIGJnLVt2YXIoLS1vdmVybGF5LWdyZXkpXSBvcGFjaXR5LTAgYWJzb2x1dGUgdy1mdWxsIGxlZnQtMCB0b3AtWzUwcHhdXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ0cmFpbGVyLWNvbnRhaW5lciByZWxhdGl2ZSB3LWZ1bGwgb3ZlcmZsb3ctaGlkZGVuIHB0LVs1Ni4yNSVdXCI+XHJcbiAgICAgICAgPGlmcmFtZVxyXG4gICAgICAgIGNsYXNzPVwidHJhaWxlciBhYnNvbHV0ZSB0b3AtMCBsZWZ0LTAgcmlnaHQtMCBib3R0b20tMCB3LWZ1bGwgaC1mdWxsIHJvdW5kZWQtdC1tZFwiXHJcbiAgICAgICAgc3JjPVwiXCJcclxuICAgICAgICB0aXRsZT1cIllvdVR1YmUgdmlkZW8gcGxheWVyXCJcclxuICAgICAgICBmcmFtZWJvcmRlcj1cIjBcIlxyXG4gICAgICAgIGFsbG93PVwiYWNjZWxlcm9tZXRlcjsgYXV0b3BsYXk7IGNsaXBib2FyZC13cml0ZTsgZW5jcnlwdGVkLW1lZGlhOyBneXJvc2NvcGU7IHBpY3R1cmUtaW4tcGljdHVyZVwiXHJcbiAgICAgICAgYWxsb3dmdWxsc2NyZWVuXHJcbiAgICAgID48L2lmcmFtZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJiYXNpYy1kZXRzIHctZnVsbCByZWxhdGl2ZSBwLVs2cHhdXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhdmctc2NvcmUgYWJzb2x1dGUgcmlnaHQtMiB0b3AtWzVweF0gdGV4dC1bMC40NzVyZW1dXCI+XHJcbiAgICAgICAgPGkgY2xhc3M9XCJmYS1yZWd1bGFyICR7ZGV0ZXJtaW5lSWNvbihtZWRpYS5hdmVyYWdlU2NvcmUpfVwiPjwvaT5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInNjb3JlLXZhbHVlIHRleHQtW3ZhcigtLW1haW4tdGV4dCldXCI+JHtcclxuICAgICAgICAgIG1lZGlhLmF2ZXJhZ2VTY29yZSAhPT0gbnVsbCA/IG1lZGlhLmF2ZXJhZ2VTY29yZSArICclJyA6ICdOQSdcclxuICAgICAgICB9PC9zcGFuPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImJhc2ljLWRldHMtZXBpc29kZXMgZm9udC1tZWRpdW0gdGV4dC1bMC40NXJlbV0gdGV4dC1bdmFyKC0tbWFpbi1icmFuZCldXCI+XHJcbiAgICAgICAgJHtkZXRlcm1pbmVFcHMobWVkaWEpfVxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdlxyXG4gICAgICAgIGNsYXNzPVwiYmFzaWMtZGV0cy1jb3VudGRvd24gdGV4dC1bMC40NXJlbV0gcGItWzFweF0gdGV4dC1bdmFyKC0taGVhZGluZy1ncmV5KV0gZm9udC1tZWRpdW1cIlxyXG4gICAgICA+XHJcbiAgICAgICAgJHtkaXNwbGF5Q291bnRkb3duKG1lZGlhKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBjbGFzcz1cImJhc2ljLWRldHMtc291cmNlIHRleHQtWzAuNHJlbV0gZm9udC1tZWRpdW0gdGV4dC1bdmFyKC0tbWFpbi10ZXh0KV0gbWItMVwiXHJcbiAgICAgID5cclxuICAgICAgICBTb3VyY2Ug4oCiICR7Zm9ybWF0U291cmNlKG1lZGlhLnNvdXJjZSl9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8cFxyXG4gICAgICAgIGNsYXNzPVwiYmFzaWMtZGV0cy1zeW5vcHNpcyB0ZXh0LVt2YXIoLS1tYWluLXRleHQpXSB0ZXh0LVswLjRyZW1dIGZvbnQtbWVkaXVtIG1iLTZcIlxyXG4gICAgICA+XHJcbiAgICAgICAke21lZGlhLmRlc2NyaXB0aW9ufVxyXG4gICAgICA8L3A+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBjbGFzcz1cImdlbnJlcyBmbGV4IGp1c3RpZnktY2VudGVyIGl0ZW1zLWNlbnRlciBnYXAtMSBwbC0xIGFic29sdXRlIHBiLTIgYm90dG9tLTAgbGVmdC0wXCJcclxuICAgICAgPlxyXG4gICAgICAke2dlbnJlcy5tYXAoZ2VucmUgPT4gY3JlYXRlR2VucmVUYWcoZ2VucmUpKS5qb2luKCcnKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICAgIGA7XHJcbiAgcmV0dXJuIG1lZGlhQ2FyZDtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGlzTmVhckVkZ2UoZWwpIHtcclxuICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgcmV0dXJuIChcclxuICAgIHJlY3QubGVmdCA8IDExMCB8fFxyXG4gICAgcmVjdC5yaWdodCA+XHJcbiAgICAgICh3aW5kb3cuaW5uZXJXaWR0aCAtIDExMCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLSAxMTApXHJcbiAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdHJhbnNEaXIoZWwpIHtcclxuICBjb25zdCB4Q29vcmRpbmF0ZSA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLng7XHJcbiAgLy8gZGV0ZXJtaW5lIHdoYXQgc2lkZSBvZiB2aWV3cG9ydCB0aGUgZWxlbWVudCBpcyBpblxyXG4gIHJldHVybiB4Q29vcmRpbmF0ZSA8IHdpbmRvdy5pbm5lcldpZHRoIC8gMiA/ICcxNTBweCcgOiAnLTE1MHB4JztcclxufVxyXG5cclxuLy8gZnVuY2lvbiBzaG93cyBiYXNpYyBhbmltZSBkZXRhaWxzIHdoZW4gbW91c2UgaXMgaG92ZXJlZCBvdmVyXHJcbmV4cG9ydCBmdW5jdGlvbiBzaG93ZGV0c19iYXNpYygpIHtcclxuICBjb25zdCB0cmFpbGVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpZnJhbWUudHJhaWxlcicpO1xyXG4gIHRoaXMuc3R5bGUuekluZGV4ID0gOTk5O1xyXG4gIHRoaXMuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDIuNCknO1xyXG4gIHRoaXMucXVlcnlTZWxlY3RvcignLmNvdmVyJykuc3R5bGUudHJhbnNmb3JtID0gJ3NjYWxlKDApJztcclxuICB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5jb3ZlcicpLnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gIHRoaXMucXVlcnlTZWxlY3RvcignLnRpdGxlJykuc3R5bGUub3BhY2l0eSA9ICcwJztcclxuICB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5kZXRhaWxzLW92ZXJsYXknKS5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICBpZiAoaXNOZWFyRWRnZSh0aGlzKSkgdGhpcy5zdHlsZS50cmFuc2xhdGUgPSB0cmFuc0Rpcih0aGlzKTtcclxuICBpZiAodHJhaWxlci5zcmMgPT09IHdpbmRvdy5sb2NhdGlvbi5ocmVmKSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdHJhaWxlci5zcmMgPSBgaHR0cHM6Ly93d3cueW91dHViZS1ub2Nvb2tpZS5jb20vZW1iZWQvJHt0aGlzLmRhdGFzZXQudmlkZW9faWR9P2NvbnRyb2xzPTBgO1xyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIGZ1bmN0aW9uIG5lZ2F0ZXMgdGhlIGVmZmVjdCBvZiBzaG93ZGV0YWlsc19iYXNpYygpXHJcbmV4cG9ydCBmdW5jdGlvbiBoaWRlZGV0c19iYXNpYygpIHtcclxuICBjb25zdCB0cmFpbGVyID0gdGhpcy5xdWVyeVNlbGVjdG9yKCdpZnJhbWUudHJhaWxlcicpO1xyXG4gIHRoaXMucXVlcnlTZWxlY3RvcignLmRldGFpbHMtb3ZlcmxheScpLnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gIHRoaXMucXVlcnlTZWxlY3RvcignLmNvdmVyJykuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgdHJhaWxlci5zcmMgPSBgYDtcclxuICB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5jb3ZlcicpLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZSgxKSc7XHJcbiAgdGhpcy5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGUoMSknO1xyXG4gIHRoaXMuc3R5bGUudHJhbnNsYXRlID0gJzAnO1xyXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgdGhpcy5zdHlsZS56SW5kZXggPSAxO1xyXG4gICAgdGhpcy5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5zdHlsZS5vcGFjaXR5ID0gJzEnO1xyXG4gIH0sIDEwMCk7XHJcbn1cclxuIiwiLy8gY29udGFpbnMgZnVuY3RpbmFsaXR5IHJlbGF0ZWQgdG8gdGhlIG5hdmJhclxyXG5cclxuZXhwb3J0IGNvbnN0IHNob3dTcmNoQmFyID0gZnVuY3Rpb24gKHNlYXJjaEJ0biwgc2VhcmNoQmFyKSB7XHJcbiAgc2VhcmNoQmFyLmNsYXNzTGlzdC5hZGQoJ192aXNpYmxlJyk7XHJcbiAgc2VhcmNoQnRuLmNsYXNzTGlzdC5hZGQoJ19oaWRkZW4nKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBoaWRlU3JjaEJhciA9IGZ1bmN0aW9uIChzZWFyY2hCdG4sIHNlYXJjaEJhcikge1xyXG4gIHNlYXJjaEJhci5jbGFzc0xpc3QucmVtb3ZlKCdfdmlzaWJsZScpO1xyXG4gIHNlYXJjaEJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdfaGlkZGVuJyk7XHJcbn07XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgc2hvd1NyY2hCYXIsIGhpZGVTcmNoQmFyIH0gZnJvbSAnLi9tb2R1bGVzL25hdic7XHJcbmltcG9ydCB7XHJcbiAgY3JlYXRlVHJlbmRpbmcsXHJcbiAgY3JlYXRlUG9wdWxhclJuLFxyXG4gIGNyZWF0ZVBvcHVsYXIsXHJcbiAgY3JlYXRlVXBjb21pbmcsXHJcbn0gZnJvbSAnLi9tb2R1bGVzL2ZlYXR1cmVkX3NlY3QnO1xyXG5cclxuLy8gRG9tIHNlbGVjdGlvblxyXG5jb25zdCBzcmNoQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlYXJjaC1idG4nKTtcclxuY29uc3Qgc3JjaEJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2gtYmFyJyk7XHJcbmNvbnN0IGhpZGVTcmNoQmFyQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhpZGUtc2VhcmNoLWJhcicpO1xyXG5cclxuLy8gZXZlbnQgbGlzdG5lcnNcclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcclxuICBjcmVhdGVUcmVuZGluZygpO1xyXG4gIGNyZWF0ZVBvcHVsYXJSbigpO1xyXG4gIGNyZWF0ZVVwY29taW5nKCk7XHJcbiAgY3JlYXRlUG9wdWxhcigpO1xyXG59KTtcclxuXHJcbnNyY2hCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgc2hvd1NyY2hCYXIoc3JjaEJ0biwgc3JjaEJhcik7XHJcbn0pO1xyXG5cclxuaGlkZVNyY2hCYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgaGlkZVNyY2hCYXIoc3JjaEJ0biwgc3JjaEJhcik7XHJcbn0pO1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=