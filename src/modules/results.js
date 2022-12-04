// contains functionality related to search results
import { getSrchRslts } from './gql';
import { createMediaCard } from './media';
import { hidedets_basic, showdets_basic, showInfo } from './media';

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
    <div class="media-wrapper min-h-[100px] results relative">
    <div class="lds-ellipsis absolute m-auto right-0 left-0 top-0 bottom-0">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    </div>
  </section>
  `;

  if (document.body.contains(document.querySelector('.results-container')))
    mainSection.removeChild(document.querySelector('.results-container'));

  mainSection.insertAdjacentHTML('beforeend', resultsSection);

  const wrapper = document.querySelector(`.media-wrapper.results`);
  return wrapper;
}

function removeAllChildNodes(parent) {
  const elements = parent.getElementsByClassName('media-card');

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

let currentPage = 1;
export async function renderResults(searchTerm) {
  const rsltsWrapper = createRsltsSection(searchTerm);
  rsltsWrapper.parentElement.querySelector('h2').textContent = searchTerm;
  const results = await getSrchRslts(searchTerm, 1);
  rsltsWrapper.querySelector('.lds-ellipsis').style.display = 'none';
  removeAllChildNodes(rsltsWrapper);
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

export async function renderMore(searchTerm) {
  if (document.body.contains(document.querySelector('.results'))) {
    const wrapper = document.querySelector(`.media-wrapper.results`);
    const results = await getSrchRslts(searchTerm, ++currentPage);
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

export const handleInfiniteScroll = searchTerm => {
  let documentHeight = document.body.scrollHeight;
  let currentScroll = window.scrollY + window.innerHeight;
  let modifier = 0;
  if (currentScroll + modifier === documentHeight) {
    renderMore(searchTerm);
  }
};
