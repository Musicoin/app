import {API_EMAIL, API_ENDPOINT, ACCESS_TOKEN} from 'react-native-dotenv';

export const RECEIVE_RELEASES = 'RECEIVE_RELEASES';

function receiveReleases(json) {
  const releases = json.data;

  return {
    type: RECEIVE_RELEASES,
    releases,
  };
}

function fetchReleasesJson() {

  var params = {
    'email':API_EMAIL,
    'accessToken': ACCESS_TOKEN,
    'limit': '5',
  };

  var formBody = [];
  for (var property in params) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(params[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return fetch(API_ENDPOINT + 'release/recent?' + formBody, {
    method: 'GET',
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  }).then(response=>response.json());

}

export function fetchReleases() {
  return function(dispatch) {
    return fetchReleasesJson().then(json => dispatch(receiveReleases(json)));
  };
}