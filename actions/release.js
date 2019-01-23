import {fetchAccessToken} from './auth';
import {RECEIVE_NEW_RELEASES_REQUEST, RECEIVE_NEW_RELEASES_SUCCESS, RECEIVE_NEW_RELEASES_FAILURE} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import Layout from '../constants/Layout';
import {API_VERSION} from 'react-native-dotenv';

function receiveReleases(json) {
  let releases;
  if (json.tracks) {
    releases = json.tracks;
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

  let results = await fetchGetData(`${API_VERSION}/release/recent?`, params);

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

      results.tracks[i].origin = 'new';
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