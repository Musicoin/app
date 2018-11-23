import {fetchAccessToken} from './index';
import {SEARCH} from '../constants/Actions';
import {fetchPostData} from '../tools/util';

function receiveSearchResults(json) {
  const searchResults = json.data;

  return {
    type: SEARCH,
    searchResults,
  };
}

async function fetchSearchResultsJson(token, artistName) {

  var params = {
    'accessToken': token,
    'limit': '10',
    'artistName': artistName,
  };

  let releases = await fetchPostData('search?', params);

  if (releases.data != []) {

    // for (let i = 0; i < releases.data.releases.length; i++) {
    //   let trackPartArray = releases.data.releases[i].trackURL.split('/');
    //   let trackId = trackPartArray[trackPartArray.length - 1];
    //   let releaseDetails = await fetchReleaseDetailsJson(token, trackId);
    //   releases.data[i] = {...releaseDetails.data, ...releases.data[i], trackId};
    //   let trackImgArray = releases.data[i].trackImg.split('/');
    //   let trackImg = await fetchTrackImageJson(trackImgArray[trackImgArray.length - 1]);
    //   releases.data[i].trackImg = trackImg;
    // }

    console.log(releases);
    return releases;
  } else {
    return releases;
  }
}

export function getSearchResults(artistName) {
  return function(dispatch, getState) {
    let accessToken = getState().accessToken;
    let diff = (Math.abs(accessToken.receivedAt - Date.now())) / 1000 / 60;
    if (diff >= 58) {
      // get a new token
      dispatch(fetchAccessToken()).then(() => {return fetchSearchResultsJson(getState().accessToken.token, artistName).then(json => dispatch(receiveSearchResults(json)));});

    } else {
      return fetchSearchResultsJson(accessToken.token, artistName).then(json => dispatch(receiveSearchResults(json)));
    }
  };
}
