import {fetchAccessToken} from './auth';
import {SEARCH_BY_GENRE_FAILURE, SEARCH_BY_GENRE_REQUEST, SEARCH_BY_GENRE_SUCCESS} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import {API_VERSION} from 'react-native-dotenv';
import Layout from '../constants/Layout';

function receiveSearchResults(json) {
  let searchResults;

  if (json.tracks) {
    searchResults = json.tracks;
  }

  return {
    type: searchResults ? SEARCH_BY_GENRE_SUCCESS : SEARCH_BY_GENRE_FAILURE,
    data: searchResults,
  };
}

async function fetchSearchResultsJson(token, genre, email) {
  var params = {
    'genre': genre,
    'accessToken': token,
    'email': email,
    'limit': 40,
  };

  let results = await fetchGetData(`${API_VERSION}/release/bygenre?`, params);

  if (results.tracks != []) {

    for (let i = 0; i < results.tracks.length; i++) {

      if (!results.tracks[i].genres) {
        results.tracks[i].genres = [];
      }

      if (!results.tracks[i].directTipCount) {
        results.tracks[i].directTipCount = 0;
      }

      if (!results.tracks[i].directPlayCount) {
        results.tracks[i].directPlayCount = 0;
      }

      if (!results.tracks[i].trackImg) {
        results.tracks[i].trackImg = Layout.defaultTrackImage;
      }

      results.tracks[i].origin = 'genre';
    }
    return results;
  } else {
    return false;
  }
}

export function getSearchByGenreResults(genre) {
  return function(dispatch, getState) {
    dispatch({type: SEARCH_BY_GENRE_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchSearchResultsJson(accessToken, genre, email).then(json => dispatch(receiveSearchResults(json)));
  };
}
