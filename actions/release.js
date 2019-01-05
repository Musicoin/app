import {fetchAccessToken} from './auth';
import {RECEIVE_NEW_RELEASES_REQUEST, RECEIVE_NEW_RELEASES_SUCCESS, RECEIVE_NEW_RELEASES_FAILURE} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import Layout from '../constants/Layout';
import {API_VERSION} from 'react-native-dotenv';

function receiveReleases(json) {
  let releases;
  if (json.releases) {
    releases = json.releases;
  }

  return {
    type: releases ? RECEIVE_NEW_RELEASES_SUCCESS : RECEIVE_NEW_RELEASES_FAILURE,
    releases,
  };
}

async function fetchReleasesJson(token, email) {
  var params = {
    'accessToken': token,
    'email': email,
    'limit': '20',
  };

  let results = await fetchGetData(`release/recent/${API_VERSION}?`, params);

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

      results.releases[i].origin = 'new';
    }
    return results;
  } else {
    return false;
  }
}

export function fetchReleases() {
  return function(dispatch, getState) {
    dispatch({type: RECEIVE_NEW_RELEASES_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchReleasesJson(accessToken, email).then(json => dispatch(receiveReleases(json)));
  };
}