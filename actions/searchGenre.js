import {fetchAccessToken} from './auth';
import {fetchReleaseDetailsJson, fetchTrackImageJson} from './release';
import {SEARCH_BY_GENRE_FAILURE, SEARCH_BY_GENRE_REQUEST, SEARCH_BY_GENRE_SUCCESS} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import {API_EMAIL} from 'react-native-dotenv';
import Layout from '../constants/Layout';

function receiveSearchResults(json) {
  let searchResults;

  if (json.success && json.data) {
    searchResults = json.data;
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

  let results = await fetchGetData(`release/bygenre?`, params);

  if (results.success && results.data) {

    for (let i = 0; i < results.data.length; i++) {
      let trackPartArray = results.data[i].link.split('/');
      let trackId = trackPartArray[trackPartArray.length - 1];
      let releaseDetails = await fetchReleaseDetailsJson(token, trackId);
      if (releaseDetails) {
        results.data[i] = {...releaseDetails.data, ...results.data[i], trackId};
        if (results.data[i].trackImg) {
          let trackImgArray = results.data[i].trackImg.split('/');
          let trackImg = await fetchTrackImageJson(trackImgArray[trackImgArray.length - 1]);
          results.data[i].trackImg = trackImg;
        } else {
          results.data[i].trackImg = Layout.defaultTrackImage;
        }
      }
      if (!results.data[i].genres) {
        results.data[i].genres = [];
      }

      if (!results.data[i].directTipCount) {
        results.data[i].directTipCount = 0;
      }

      if (!results.data[i].directPlayCount) {
        results.data[i].directPlayCount = 0;
      }

      if(results.data[i].trackImg.startsWith('ipfs://')){
        results.data[i].trackImg = Layout.defaultTrackImage;
      }

      results.data[i].origin = 'genre';
    }
    console.log(results);
    return results;
  } else {
    return false;
  }
}

export function getSearchByGenreResults(genre) {
  return function(dispatch, getState) {
    dispatch({type: SEARCH_BY_GENRE_REQUEST});
    let accessToken = getState().accessToken;
    let diff = (Math.abs(accessToken.receivedAt - Date.now())) / 1000 / 60;
    if (diff >= 58) {
      // get a new token
      dispatch(fetchAccessToken()).then(() => {return fetchSearchResultsJson(getState().accessToken.token, genre).then(json => dispatch(receiveSearchResults(json)));});

    } else {
      return fetchSearchResultsJson(accessToken.token, genre).then(json => dispatch(receiveSearchResults(json)));
    }
  };
}
