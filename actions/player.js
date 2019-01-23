import {PLAY_TRACK} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import {API_VERSION} from 'react-native-dotenv';

export function dispatchPlayTrack(track, addToLastPlayed = true) {
  return {
    type: PLAY_TRACK,
    track,
    addToLastPlayed,
  };
}

async function fetchReleaseDetailsJson(token, email, track) {
  var params = {
    'accessToken': token,
    'email': email,
  };

  let result = await fetchGetData(`${API_VERSION}/release/detail/${track.trackAddress}?`, params);

  if (result.success && result.data != null) {
    result.data.origin = track.origin;
    return result;
  } else {
    return false;
  }
}

export function playTrack(track, addToLastPlayed) {
  return function(dispatch, getState) {
    let {accessToken, email} = getState().auth;
    return fetchReleaseDetailsJson(accessToken, email, track).then(json => {
      if (json.success) {
        dispatch(dispatchPlayTrack(json.data, addToLastPlayed));
      } else {
        dispatch(dispatchPlayTrack(track, addToLastPlayed));
      }
    });
  };
};