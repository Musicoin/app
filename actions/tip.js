import {TIP_TRACK} from '../constants/Actions';
import {fetchPostFormDataJson} from '../tools/util';
import {addAlert} from './alert';
import {API_EMAIL} from 'react-native-dotenv';

function addTip(trackId, json) {
  console.log(json);
  return function(dispatch, getState) {
    let success = false;
    if (json.success) {
      dispatch(addAlert('success', 'thank you!', 'Tip will be added when the next block is mined'));
      success = true;
    } else {
      dispatch(addAlert('error', 'Something went wrong', 'Please try again later'));
    }
    dispatch({
      type: TIP_TRACK,
      trackId: trackId,
      success,
    });
  };
}

async function tipTrackJson(trackId, token) {
  let params = {
    tip: 1,
  };

  let tipTrack = await fetchPostFormDataJson(`release/tip/${trackId}?email=${API_EMAIL}&accessToken=${token}`, params);
  return tipTrack;

}

export function tipTrack(trackId) {
  return function(dispatch, getState) {
    let accessToken = getState().accessToken;
    return tipTrackJson(trackId, accessToken.token).then(json => dispatch(addTip(trackId, json)));
  };
}
