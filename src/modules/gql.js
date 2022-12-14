// config for Anilist gql api requests

const DEFAULT_FIELDS = `id
  idMal
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

// determines current anime season
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

// determines upcoming anime season
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

// gql queries and variable for featured section data
export const QUERIES_AND_VARIABLES = {
  popularAiring: {
    query: `query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            perPage
          }
          media(type: ANIME, season: ${getSeason()}, seasonYear: ${getYear()}, sort: POPULARITY_DESC, isAdult: false) {
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
        ).toUpperCase()}, sort: POPULARITY_DESC, isAdult: false) {
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
          media(type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
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
          media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
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

// returns list of anime data
export async function getMedia(query, variables) {
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

/*
return list of anime data
based on a supplied search value
 */
export async function getSrchRslts(searchQuery, pageNum) {
  const query = `
  query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(search: $search, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
        ${DEFAULT_FIELDS}
      }
    }
  }
  
`;

  let variables = {
    search: searchQuery,
    page: pageNum,
    perPage: 20,
  };

  // Define the config we'll need for our Api request
  let url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  let res = await fetch(url, options);
  let data = await res.json();
  return data.data.Page.media;
}

// returns anime data based on an id
export async function getAnimeInfo(ID) {
  const query = `
  query ($id: Int) {
      Media(type: ANIME, id: $id) {
        ${DEFAULT_FIELDS}
      }
  }
  
`;

  let variables = {
    id: ID,
  };

  // Define the config we'll need for our Api request
  let url = 'https://graphql.anilist.co',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };

  let res = await fetch(url, options);
  let data = await res.json();
  return data.data.Media;
}
