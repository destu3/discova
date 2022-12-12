/* 
determines next airing episode or the final episode air date based
on the media status property
*/
function determineEps(media) {
  return media.status;
}

// determines rating icon & colour
export function determineIcon(rating) {
  if (rating === null) {
    return 'fa-face-dizzy text-[#929292]';
  } else if (rating > 0 && rating < 65) {
    return 'fa-face-frown text-[#CF6679]';
  } else if (rating >= 65 && rating < 75) {
    return 'fa-face-meh text-[#FF7A3C]';
  } else {
    return 'fa-face-smile text-[#7BD555]';
  }
}

// converts seconds to d/h/m format
function toDaysMinutesSeconds(totalSeconds) {
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

// formats the string value of the media source material
function formatSource(source) {
  if (source === null) {
    return 'Unknown';
  }
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

// creates a genre component
export function createGenreTag(genre, size, textColour, pr = 'pr-0') {
  return `<div class="genre inline font-medium ${size} ${pr} ${textColour}">${genre}</div>`;
}

// determines how long until the next episode, if there is one
export function displayCountdown(media) {
  if (!media.seasonYear && media.status === 'NOT_YET_RELEASED') {
    return 'Coming Soon';
  } else if (media.status === 'NOT_YET_RELEASED') {
    return `Airing in ${media.seasonYear}`;
  } else if (!media.nextAiringEpisode && media.status === 'RELEASING') {
    return `Next ep airing in ${toDaysMinutesSeconds(
      media.nextAiringEpisode?.timeUntilAiring
    )}`;
  } else if (media.status === 'RELEASING') {
    return `Ep ${
      media.nextAiringEpisode.episode
    } airing in ${toDaysMinutesSeconds(
      media.nextAiringEpisode?.timeUntilAiring
    )}`;
  } else if (
    (media.status === 'FINISHED' && !media.endDate.day) ||
    !media.endDate.month
  ) {
    return `Aired in ${media.endDate.year}`;
  } else if (media.status === 'FINISHED') {
    return `Episode ${media.episodes} aired on ${media.endDate.day}/${media.endDate.month}/${media.endDate.year}`;
  }
}

// creates and returns a media component
export const createMediaCard = function (media) {
  const genres = media.genres.slice(0, 2);
  const mediaCard = `
  <div
  class="media-card relative rounded-md"
  data-video_id="${media.trailer?.id}"
  data-media_id="${media.id}"
>
  <div
    class="cover z-20 cursor-pointer w-full h-[229.19px] rounded-md relative overflow-hidden inline-block"
  >
    <img
      class="w-full h-full absolute left-0 top-0 object-cover poster"
      src="${media.coverImage.extraLarge}"
      alt=""
    />
  </div>
  <div
    href=""
    class="title text-[0.8rem] md:text-[0.9rem] pt-1 inline-block w-[140px] md:w-[180px] overflow-hidden text-ellipsis"
  >
    ${media.title?.english || media.title?.romaji || media.title?.native}
  </div>
  <div
    class="details-overlay overflow-hidden rounded-md bg-[var(--overlay-grey)] opacity-0 absolute w-full left-0 top-[50px]"
  >
    <div class="featured-media relative w-full pt-[40.25%]">
      <img class="featured-img w-full h-full object-center object-cover absolute top-0 bottom-0 right-0 left-0" src="${
        media.bannerImage ? media.bannerImage : media.coverImage.extraLarge
      }"/>
    </div>
    <div class="basic-dets w-full relative p-[6px]">
      <div class="avg-score absolute right-2 top-[5px] text-[0.475rem]">
        <i class="fa-regular ${determineIcon(media.averageScore)}"></i>
        <span class="score-value text-[var(--main-text)]"
          >${
            media.averageScore !== null ? media.averageScore + '%' : 'N/A'
          }</span
        >
      </div>
      <div
        class="basic-dets-episodes font-medium text-[0.45rem] text-[var(--main-brand)]"
      >
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
        Source • ${formatSource(media?.source)}
      </div>
      <p
        class="basic-dets-synopsis text-[var(--main-text)] text-[0.4rem] font-medium mb-6"
      >
        ${media.description}
      </p>
      <div
        class="genres flex justify-center items-center gap-1 pl-[0.4rem] absolute bottom-[10px] left-0"
      >
        ${genres
          .map(genre =>
            createGenreTag(genre, 'text-[0.4rem]', 'text-[var(--main-brand)]')
          )
          .join('')}
      </div>
      <button
        title="Add to List"
        class="add-basic flex justify-center items-center border-[var(--main-text)] border-solid border-[1px] rounded-[50%] h-4 w-4 absolute bottom-2 right-7"
      >
        <i class="fa-solid fa-plus text-[var(--main-text)] text-[8px]"></i>
      </button>
      <button
        title="View Info & Episodes"
        class="view-info flex justify-center items-center more-dets border-[var(--main-text)] border-solid border-[1px] rounded-[50%] h-4 w-4 absolute bottom-2 right-2"
      >
        <i
          class="fa-solid fa-chevron-down text-[var(--main-text)] text-[8px]"
        ></i>
      </button>
    </div>
  </div>
</div>

  `;

  return mediaCard;
};

// detects if an element is near the edge
function isNearEdge(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.left < 150 ||
    rect.right >
      (window.innerWidth - 150 || document.documentElement.clientWidth - 150)
  );
}

/*
moves an element in the opposite
direction if it is near the edge of the visualViewport
*/
function transDir(el) {
  const xCoordinate = el.getBoundingClientRect().x;
  // determine what side of viewport the element is in
  return xCoordinate < window.innerWidth / 2 ? '125px' : '-125px';
}

// shows basic anime details of a card component
export function showdets_basic() {
  const detailsOverlay = this.querySelector('.details-overlay');
  const cover = this.querySelector('.cover');
  this.style.zIndex = 999;
  detailsOverlay.style.transform = 'scale(2.2)';
  setTimeout(() => {
    cover.style.pointerEvents = 'none';
  }, 300);
  this.querySelector('.title').style.opacity = '0';
  detailsOverlay.style.opacity = 1;
  if (isNearEdge(this)) detailsOverlay.style.translate = transDir(this);
  cover.style.opacity = 0;
}

// hides basic anime details of a card component
export function hidedets_basic() {
  const detailsOverlay = this.querySelector('.details-overlay');
  const cover = this.querySelector('.cover');
  this.style.zIndex = 1;
  detailsOverlay.style.opacity = 0;
  cover.style.pointerEvents = 'auto';
  detailsOverlay.style.transform = 'scale(1)';
  detailsOverlay.style.translate = '0';
  setTimeout(() => {
    cover.style.opacity = 1;
    this.querySelector('.title').style.opacity = '1';
  }, 200);
}
