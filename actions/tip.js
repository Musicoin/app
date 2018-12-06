import {TIP_TRACK} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import {addAlert} from './alert';

function addTip(trackId, json) {
  return function(dispatch, getState) {
    let success = false;
    if (json.res == 200) {
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
    'address': trackId,
    'accessToken': token,
  };

  let tipTrack = await fetchGetData('license/tip?', params);
  return tipTrack;

}

export function tipTrack(trackId) {
  return function(dispatch, getState) {
    let accessToken = getState().accessToken;
    return tipTrackJson(trackId, accessToken.token).then(json => dispatch(addTip(trackId, json)));
  };
}
