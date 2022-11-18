export const createMediaCard = function (media) {
  const mediaCard = `<div class="swiper-slide cursor-pointer relative max-w-[144px] md:max-w-[185px] h-fit rounded-md media-card" data-video_id =${
    media.trailer?.id
  } data-media_id=${media.id}>
      <div class="cover w-full cursor-pointer rounded-md overflow-hidden z-10 inline-block"
        ><img
        class="w-full h-[202.54px] md:h-[265px] object-cover" src="${
          media.coverImage.extraLarge
        }" alt=""/>
      </div>
      <a href="" class="title text-[0.8rem] md:text-[0.9rem] pt-1 inline-block w-[140px] md:w-[180px] overflow-hidden text-ellipsis">${
        media.title?.english || media.title?.romaji || media.title?.native
      }</a>
      <div class="details-overlay rounded-md bg-[var(--overlay-grey)] opacity-0 absolute h-[202.54px] md:h-[265px] w-full left-0 top-0">
      <div class="trailer-container relative w-full overflow-hidden pt-[56.25%]">
        <iframe
          class="rounded-md trailer absolute top-0 left-0 right-0 bottom-0 w-full h-full"
          src=""
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    </div>
      `;
  return mediaCard;
};

const getTransX = function (wrapper) {
  const translatedX = wrapper.style.transform
    .replace('translate3d', '')
    .replace(/\(|\)/g, '')
    .split(',')[0]
    .replace('px', '');
  return translatedX;
};

// funcion shows basic anime details when mouse is hovered over

export function showdets_basic(wrapper) {
  const trailer = this.querySelector('iframe.trailer');
  if (trailer.src === window.location.href) {
    trailer.src = `https://www.youtube-nocookie.com/embed/${this.dataset.video_id}`;
  }
  const sect = wrapper.parentElement.classList[0];
  const swiper = document.querySelector(`.${sect}.swiper`).swiper;

  const translatedX = getTransX(wrapper);
  if (this === wrapper.firstElementChild) {
    swiper.setTranslate(120);
  }

  if (this === wrapper.lastElementChild) {
    swiper.setTranslate(Number(translatedX) - 120);
  }

  this.style.transform = 'scale(1.7)';
  this.style.zIndex = 999;
  this.querySelector('.cover').style.opacity = 0;
  this.querySelector('.details-overlay').style.opacity = 1;
}

// function negates the effect of showdetails_basic()
export function hidedets_basic(wrapper) {
  const trailer = this.querySelector('iframe.trailer');
  trailer.src = ``;

  const sect = wrapper.parentElement.classList[0];
  const swiper = document.querySelector(`.${sect}.swiper`).swiper;

  if (this === wrapper.firstElementChild) {
    swiper.slideToClosest(1250);
  }

  if (this === wrapper.lastElementChild) {
    swiper.slideToClosest(1250);
  }

  this.style.transform = 'scale(1)';
  this.style.zIndex = 1;
  this.querySelector('.cover').style.opacity = 1;
  this.querySelector('.details-overlay').style.opacity = 0;
}
