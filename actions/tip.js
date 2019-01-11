import {TIP_TRACK, ALLOW_NEXT_TIP} from '../constants/Actions';
import {TIP_TIMEOUT_MILIS} from '../constants/App';
import {fetchPostFormDataJson} from '../tools/util';
import {addAlert} from './alert';
import {API_VERSION} from 'react-native-dotenv';

function addTip(trackAddress, json) {
  console.log(json);
  return function(dispatch, getState) {
    let success = false;
    if (json.tx) {
      dispatch(addAlert('success', 'Your tip has been sent successfully!', 'Thanks for supporting your favorite artists.'));
      setTimeout(() => dispatch({type: ALLOW_NEXT_TIP, data: true}), TIP_TIMEOUT_MILIS);
      success = true;
    } else {
      dispatch({type: ALLOW_NEXT_TIP, data: true});
      dispatch(addAlert('error', 'Something went wrong', 'Please retry your tip at a later time.'));
    }
    dispatch({
      type: TIP_TRACK,
      trackAddress: trackAddress,
      success,
    });
  };
}

async function tipTrackJson(trackAddress, token, email) {
  let params = {
    trackAddress,
    musicoins: 1,
  };

  let tipTrack = await fetchPostFormDataJson(`release/tiptrack/${API_VERSION}?email=${email}&accessToken=${token}`, params);
  return tipTrack;
}

export function tipTrack(trackAddress) {
  return function(dispatch, getState) {
    dispatch({type: ALLOW_NEXT_TIP, data: false});
    let {accessToken, email} = getState().auth;
    return tipTrackJson(trackAddress, accessToken, email).then(json => dispatch(addTip(trackAddress, json)));
  };
}
