import {API_EMAIL, API_PASSWORD, API_USERNAME, API_CLIENT_SECRET, API_ENDPOINT, ACCESS_TOKEN} from 'react-native-dotenv';

export const RECEIVE_ACCESS_TOKEN = 'RECEIVE_ACCESS_TOKEN';
export const RECEIVE_RELEASES = 'RECEIVE_RELEASES';

function receiveAccessToken(json) {
  const {accessToken} = json;

  return {
    type: RECEIVE_ACCESS_TOKEN,
    accessToken: {token: accessToken, receivedAt: Date.now()},
  };
}

function fetchAccessTokenJson() {

  var params = {
    'password': API_PASSWORD,
    'username': API_USERNAME,
    'clientSecret': API_CLIENT_SECRET,

  };

  return fetchPostData('authtoken', params);

}

export function fetchAccessToken() {
  return function(dispatch) {
    return fetchAccessTokenJson().then(json => dispatch(receiveAccessToken(json)));
  };
}

function receiveReleases(json) {
  const releases = json.data;

  return {
    type: RECEIVE_RELEASES,
    releases,
  };
}

function fetchReleasesJson(token) {

  var params = {
    'accessToken': token,
    'limit': '5',
  };

  return fetchData('release/recent?', params);

}

function fetchData(action, params) {
  let newParams = {
    ...params,
    'email': API_EMAIL,
  };

  let formBody = [];
  for (let property in newParams) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(newParams[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  return fetch(API_ENDPOINT + action + formBody, {
    method: 'GET',
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(response => response.json());
}

function fetchPostData(action, params) {
  let newParams = {
    ...params,
    'email': API_EMAIL,
  };

  let formBody = [];
  for (let property in newParams) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(newParams[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  return fetch(API_ENDPOINT + action, {
    method: 'POST',
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody
  }).then(response => response.json());
}


export function fetchReleases() {
  return function(dispatch, getState) {
      let accessToken = getState().accessToken;
      console.log(accessToken);
      let diff = (Math.abs(accessToken.receivedAt - Date.now())) / 1000 / 60;
      if (diff >= 58) {
        // get a new token
        dispatch(fetchAccessToken());
        setTimeout(() => fetchReleasesJson(getState().accessToken.token).then(json => dispatch(receiveReleases(json))), 500);

      } else {
        return fetchReleasesJson(accessToken.token).then(json => dispatch(receiveReleases(json)));
      }
  };
}