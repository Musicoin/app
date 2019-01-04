import {fetchAccessToken} from './auth';
import {SEARCH_BY_GENRE_FAILURE, SEARCH_BY_GENRE_REQUEST, SEARCH_BY_GENRE_SUCCESS} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import {API_EMAIL, API_VERSION} from 'react-native-dotenv';
import Layout from '../constants/Layout';

function receiveSearchResults(json) {
  let searchResults;

  if (json.success && json.releases) {
    searchResults = json.releases;
  }

  return {
    type: searchResults ? SEARCH_BY_GENRE_SUCCESS : SEARCH_BY_GENRE_FAILURE,
    data: searchResults,
  };
}

async function fetchSearchResultsJson(token, genre) {
  var params = {
    'genre': genre,
    'accessToken': token,
  };

  let results = await fetchGetData(`release/bygenre/${API_VERSION}?`, params);

  if (results.success && results.releases != []) {

    for (let i = 0; i < results.releases.length; i++) {

      if (!results.releases[i].genres) {
        results.releases[i].genres = [];
      }

      if (!results.releases[i].directTipCount) {
        results.releases[i].directTipCount = 0;
      }

      if (!results.releases[i].directPlayCount) {
        results.releases[i].directPlayCount = 0;
      }

      if (!results.releases[i].trackImg) {
        results.releases[i].trackImg = Layout.defaultTrackImage;
      }

      results.releases[i].origin = 'genre';
    }
    return results;
  } else {
    return false;
  }
}

export function getSearchByGenreResults(genre) {
  return function(dispatch, getState) {
    dispatch({type: SEARCH_BY_GENRE_REQUEST});
    let accessToken = getState().accessToken;
    return fetchSearchResultsJson(accessToken.token, genre).then(json => dispatch(receiveSearchResults(json)));
  };
}
