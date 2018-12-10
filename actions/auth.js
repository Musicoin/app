import {fetchPostData} from '../tools/util';
import {API_CLIENT_SECRET, API_PASSWORD, API_USERNAME, API_VERSION} from 'react-native-dotenv';
import {RECEIVE_ACCESS_TOKEN} from '../constants/Actions';

function receiveAccessToken(json) {
  const {accessToken} = json;

  return {
    type: RECEIVE_ACCESS_TOKEN,
    accessToken: {token: accessToken, receivedAt: Date.now()},
  };
}

async function fetchAccessTokenJson() {

  var params = {
    'password': API_PASSWORD,
    'username': API_USERNAME,
    'clientSecret': API_CLIENT_SECRET,

  };

  return fetchPostData(`${API_VERSION}/accesstoken`, params);

}

export function fetchAccessToken() {
  return function(dispatch) {
    return fetchAccessTokenJson().then(json => dispatch(receiveAccessToken(json)));
  };
}
