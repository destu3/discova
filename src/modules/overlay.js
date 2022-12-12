import { getAnimeInfo } from './gql';
import { removeAllChildNodes } from './results';
import { osBody } from '..';
import { displayCountdown } from './media';

// selecting dom nodes on the info-modal
const overlay = document.querySelector('.info-overlay');
const infoModal = overlay.querySelector('.info-modal');
const info = overlay.querySelector('.info');
const ring = overlay.querySelector('.lds-ring');
const background = overlay.querySelector('.background');
const poster = overlay.querySelector('.info-poster');
const header = overlay.querySelector('.header_poster .background');
const rating = overlay.querySelector('.score-value');
const title = overlay.querySelectorAll('.info-title');
const genres = overlay.querySelector('.info-genres');
const nextEp = overlay.querySelectorAll('.info-next');
const relSeason = overlay.querySelector('.release-season');
const status = overlay.querySelector('.anime-status');
const type = overlay.querySelector('.anime-type');
const eps = overlay.querySelector('.episodes');
const video = overlay.querySelector('.op-theme');
const vidsCont = overlay.querySelector('.videos');
const opPanel = overlay.querySelector('.ops.themes');
const opts = overlay.querySelector('.openings');
const synopsis = overlay.querySelectorAll('.info-synopsis');
const accIndicator = overlay.querySelector('.acc-indicator');

// add toggle functionality to accordians
export function setupThemesAccordion() {
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(accordion => {
    accordion.addEventListener('click', function (e) {
      if (this === e.target || accIndicator === e.target) {
        const themesPanel = document.querySelector('.themes');
        if (themesPanel.style.transform === 'translateY(-100%)') {
          themesPanel.style.transform = 'translateY(0)';
          accIndicator.classList.add('down');
        } else {
          themesPanel.style.transform = 'translateY(-100%)';
          accIndicator.classList.remove('down');
        }
      }
    });
  });
}

// returns opening themes for an anime
async function getOpenings(animeId) {
  const res = await fetch(
    `https://api.animethemes.moe/anime?filter[has]=resources&filter[site]=Anilist&filter[external_id]=${animeId}&include=animethemes.animethemeentries.videos.audio`
  );
  const anime = await res.json();
  const themes = anime.anime[0].animethemes;
  const ops = themes
    .filter(theme => theme.type === 'OP')
    .map(op => op.animethemeentries)
    .map(themeVers => themeVers[0].videos)
    .map(data => data[0])
    .map(vid => vid);
  return ops;
}

function createOption(value, i) {
  if (i === 0)
    return `
    <option selected class="op" value="${value}">Opening ${i}</option>           
  `;
  else
    return `
    <option class="op" value="${value}">Opening ${i}</option>           
  `;
}

function formatUpperLower(string) {
  return (
    string.replaceAll('_', ' ').charAt(0).toUpperCase() +
    string.replaceAll('_', ' ').slice(1).toLowerCase()
  );
}

// returns video link for a theme
async function getLink(basaename) {
  const res = await fetch(`https://api.animethemes.moe/video/${basaename}`);
  const data = await res.json();
  return data;
}

let initialX = null;
let initialY = null;

function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
}

function moveTouch(e) {
  if (initialX === null) {
    return;
  }

  if (initialY === null) {
    return;
  }

  let currentX = e.touches[0].clientX;
  let currentY = e.touches[0].clientY;

  let diffX = initialX - currentX;
  let diffY = initialY - currentY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      console.log('swiped left');
    } else {
      // swiped right
      console.log('swiped right');
    }
  } else {
    // sliding vertically
    if (diffY > 0) {
      // swiped up
      console.log('swiped up');
    } else {
      // swiped down
      if (currentY - initialY >= 50) {
        //swiped for at least 50px
        console.log('swiped down');
        hideInfo();
      }
    }
  }

  e.preventDefault();
}

/* 
shows detailed information about an anime 
and disables scrolling on the body
*/
export function showInfo() {
  const back = overlay.querySelector('.sm-back-btn');
  back.addEventListener('click', hideInfo);
  osBody.options({
    overflow: {
      y: 'hidden',
    },
  });

  infoModal.addEventListener('touchstart', startTouch, false);
  infoModal.addEventListener('touchmove', moveTouch, false);

  setTimeout(() => {
    infoModal.classList.add('scaled-def');
  }, 200);

  overlay.classList.remove('pointer-events-none');
  overlay.classList.remove('opacity-0');
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hideInfo();
  });

  getAnimeInfo(this.dataset.media_id).then(animeInfo => {
    console.log(animeInfo);
    info.classList.remove('hidden');
    ring.style.display = 'none';
    getOpenings(animeInfo.id).then(result => {
      if (opts.childElementCount === 0) {
        result.forEach((op, i) => {
          opts.insertAdjacentHTML(
            'beforeend',
            createOption(op.basename, i + 1)
          );
        });
      }

      getLink(opts.firstElementChild.value).then(result => {
        video.src = `${result.video.link}`;
        video.addEventListener('loadedmetadata', function () {
          accIndicator.classList.add('down');
          opPanel.style.transform = 'translateY(0)';
        });
      });
    });

    opts.addEventListener('change', function () {
      getLink(this.value).then(result => {
        video.src = `${result.video.link}`;
        video.addEventListener('canplay', video.play);
      });
    });

    background.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.7),rgba(0, 0, 0, 0.7) ),url(${animeInfo.coverImage.extraLarge})`;
    if (animeInfo.bannerImage) {
      header.classList.add('blur-[6px]');
      header.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.6) ),url(${animeInfo.bannerImage})`;
    } else {
      header.classList.remove('blur-[6px]');
      header.style.backgroundImage =
        'linear-gradient(rgba(30,30,30,0.4),rgba(30,30,30,0.4))';
    }
    poster.src = animeInfo.coverImage.extraLarge;
    poster.addEventListener('load', () => {
      poster.classList.remove('hidden');
    });
    rating.textContent = !animeInfo.averageScore
      ? '-'
      : animeInfo.averageScore + '%';

    title.forEach(
      title =>
        (title.textContent = animeInfo.title
          ? animeInfo.title.english ||
            animeInfo.title.romaji ||
            animeInfo.title.native
          : '-')
    );

    genres.textContent = animeInfo.genres ? animeInfo.genres.join(', ') : '-';
    nextEp.forEach(
      nextEp => (nextEp.textContent = displayCountdown(animeInfo))
    );
    relSeason.textContent = animeInfo.season
      ? `${formatUpperLower(animeInfo.season)} ${animeInfo.seasonYear}`
      : '-';
    status.textContent = animeInfo.status
      ? formatUpperLower(animeInfo.status)
      : '-';
    type.textContent = animeInfo.format
      ? formatUpperLower(animeInfo.format)
      : '-';
    eps.textContent = !animeInfo.episodes ? '-' : animeInfo.episodes;
    synopsis.forEach(
      synopsis =>
        (synopsis.innerHTML = !animeInfo.description
          ? 'No Synopsis'
          : animeInfo.description)
    );
  });
}

/* 
hides detailed information about an anime 
and re-enables scrolling on the body
*/
export function hideInfo() {
  const toBeErased = [rating, video, title, genres, status, eps, relSeason];
  osBody.options({
    overflow: {
      y: 'scroll',
    },
  });
  document.querySelector('body').classList.remove('no-scroll');
  removeAllChildNodes(opts, 'op');
  overlay.classList.add('pointer-events-none');
  overlay.scrollTo(0, 0);
  overlay.classList.add('opacity-0');
  infoModal.classList.remove('scaled-def');
  setTimeout(() => {
    toBeErased.forEach(node => (node.textContent = ''));
    video.src = '';
    opPanel.style.transform = 'translateY(-100%)';
    accIndicator.classList.remove('down');
    synopsis.forEach(synopsis => (synopsis.innerHTML = ''));
    synopsis.innerHTML = '';
    background.style.backgroundImage = ``;
    header.style.backgroundImage =
      'linear-gradient(rgba(30,30,30,0.4),rgba(30,30,30,0.4))';
    ring.style.display = 'inline-block';
    poster.src = '';
    removeAllChildNodes(vidsCont, 'theme');
    info.classList.add('hidden');
    poster.classList.add('hidden');
  }, 250);
}
