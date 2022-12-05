// contains functionality related to search results
import { getSrchRslts } from './gql';
import { createMediaCard } from './media';
import { hidedets_basic, showdets_basic, showInfo } from './media';
import { createSkeletonCard } from './skeleton';

function createRsltsSection(searchValue) {
  const mainSection = document.querySelector('main');
  if (document.body.contains(document.querySelector('.featured-sect'))) {
    const featuredSects = document.querySelectorAll('.featured-sect');
    featuredSects.forEach(featuredSect =>
      featuredSect.parentNode.removeChild(featuredSect)
    );
  }

  const resultsSection = `
  <section class="results results-container w-full relative bottom-6 mt-10 sm:px-0">
    <div class="results-header pb-[30px] flex justify-between items-center">
      <h2 class="search-value !text-[var(--main-brand)]">${searchValue}</h2>
    </div>
    <div class="media-wrapper min-h-[150px] results relative"></div>
  </section>
  `;

  if (document.body.contains(document.querySelector('.results-container')))
    mainSection.removeChild(document.querySelector('.results-container'));

  mainSection.insertAdjacentHTML('beforeend', resultsSection);

  const wrapper = document.querySelector(`.media-wrapper.results`);
  for (let i = 0; i <= 19; i++) {
    wrapper.insertAdjacentHTML('beforeend', createSkeletonCard());
  }
  return wrapper;
}

export function removeAllChildNodes(parent, className) {
  const elements = parent.getElementsByClassName(className);

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

let currentPage = null;
export async function renderResults(searchTerm) {
  currentPage = 1;
  const rsltsWrapper = createRsltsSection(searchTerm);
  rsltsWrapper.parentElement.querySelector('h2').textContent = searchTerm;
  const results = await getSrchRslts(searchTerm, currentPage);
  removeAllChildNodes(rsltsWrapper, 'skeleton-card');
  removeAllChildNodes(rsltsWrapper, 'media-card');
  results.forEach(result => {
    rsltsWrapper.insertAdjacentHTML('beforeend', createMediaCard(result));
  });

  rsltsWrapper.childNodes.forEach(child => {
    if (child.nodeName !== 'DIV') rsltsWrapper.removeChild(child);
  });

  let timeoutId = null;
  const mediaCards = document.querySelectorAll(`.results .media-card`);
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

    card.addEventListener('click', function () {
      showInfo.call(card);
      hidedets_basic.call(card);
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
}

let more = true;
export async function renderMore(searchTerm) {
  if (document.body.contains(document.querySelector('.results'))) {
    const checkForMore = await getSrchRslts(searchTerm, currentPage + 1);
    more = checkForMore.length === 0 ? false : true;
    console.log(more);
    const wrapper = document.querySelector(`.media-wrapper.results`);
    for (let i = 0; i <= 10; i++) {
      if (more) wrapper.insertAdjacentHTML('beforeend', createSkeletonCard());
    }
    ++currentPage;
    const results = await getSrchRslts(searchTerm, currentPage);

    removeAllChildNodes(wrapper, 'skeleton-card');
    results.forEach(result => {
      wrapper.insertAdjacentHTML('beforeend', createMediaCard(result));
    });
  } else {
    return;
  }

  let timeoutId = null;
  const mediaCards = document.querySelectorAll(`.results .media-card`);
  mediaCards.forEach(card => {
    if (!window.matchMedia('(pointer: coarse)').matches) {
      // touchscreen
      card.addEventListener('mouseenter', function (e) {
        timeoutId = setTimeout(function () {
          showdets_basic.call(card);
        }, 600);
      });
    }
    card.addEventListener('click', function (e) {
      console.log(this);
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
}

let oldScrollY = window.scrollY;
export function handleInfiniteScroll(searchTerm) {
  let documentHeight = document.body.scrollHeight;
  let currentScroll = window.scrollY + window.innerHeight;
  let modifier = 0;

  if (oldScrollY < window.scrollY) {
    // scrolling down
    if (currentScroll + modifier >= documentHeight) {
      renderMore(searchTerm);
    }
  }

  oldScrollY = window.scrollY;
}
