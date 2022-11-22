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

export const createMediaCard = function (media) {
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
export function showdets_basic() {
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
export function hidedets_basic() {
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