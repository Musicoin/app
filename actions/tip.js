import {TIP_TRACK} from '../constants/Actions';
import {fetchPostFormDataJson} from '../tools/util';
import {addAlert} from './alert';
import {API_EMAIL} from 'react-native-dotenv';

function addTip(trackId, json) {
  console.log(json);
  return function(dispatch, getState) {
    let success = false;
    if (json.success) {
      dispatch(addAlert('success', 'Your tip has been sent successfully!', 'Thanks for supporting your favorite artists.'));
      success = true;
    } else {
      dispatch(addAlert('error', 'Something went wrong', 'Please retry your tip at a later time.'));
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
