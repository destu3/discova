// contains functionality related to search results
import { getSrchRslts } from './gql';
import { createMediaCard } from './media';
import { hidedets_basic, showdets_basic } from './media';
import { createSkeletonCard } from './skeleton';
import { showInfo } from './overlay';
import { onlyDivs, addCardEventListeners } from './featured_sect';

// creates a results container component
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
  // render skeleton components to indicate that content is loading
  for (let i = 0; i <= 14; i++) {
    wrapper.insertAdjacentHTML('beforeend', createSkeletonCard());
  }
  return wrapper;
}

// remove all child nodes that have a specified class name
export function removeAllChildNodes(parent, className) {
  const elements = parent.getElementsByClassName(className);

  while (elements[0]) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

let currentPage = null;
// create media card components and add them to results container
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

  onlyDivs(rsltsWrapper);

  const mediaCards = document.querySelectorAll(`.results .media-card`);
  addCardEventListeners(mediaCards);
}

let more = true;
// create more anime cards and add them to container
export async function renderMore(searchTerm) {
  if (document.body.contains(document.querySelector('.results'))) {
    const checkForMore = await getSrchRslts(searchTerm, currentPage + 1);
    more = checkForMore.length === 0 ? false : true;
    const wrapper = document.querySelector(`.media-wrapper.results`);
    for (let i = 0; i <= 9; i++) {
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

  const mediaCards = document.querySelectorAll(`.results .media-card`);
  addCardEventListeners(mediaCards);
}

let oldScrollY = window.scrollY;
// loads more results when scrolled to bottom of screen
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
