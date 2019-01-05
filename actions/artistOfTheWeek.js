import {API_VERSION} from 'react-native-dotenv';
import {fetchGetData} from '../tools/util';
import {ARTIST_OF_THE_WEEK_FAILURE, ARTIST_OF_THE_WEEK_REQUEST, ARTIST_OF_THE_WEEK_SUCCESS} from '../constants/Actions';

function receiveArtistOfTheWeek(json) {
  return {
    type: json ? ARTIST_OF_THE_WEEK_SUCCESS : ARTIST_OF_THE_WEEK_FAILURE,
    data: json,
  };
}

async function fetchArtistOfTheWeekJson(token, email) {
  var params = {
    'accessToken': token,
    'email': email,
  };

  let result = await fetchGetData(`artist/ofweek/${API_VERSION}?`, params);

  if (result) {
    return result;
  } else {
    return false;
  }
}

export function fetchArtistOfTheWeek() {
  return function(dispatch, getState) {
    dispatch({type: ARTIST_OF_THE_WEEK_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchArtistOfTheWeekJson(accessToken, email).then(json => dispatch(receiveArtistOfTheWeek(json)));
  };
}