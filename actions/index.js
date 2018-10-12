// import {request} from 'request';

export const RECEIVE_RELEASES = 'RECEIVE_RELEASES';

function receiveReleases(json) {
  const releases = json.data;

  return {
    type: RECEIVE_RELEASES,
    releases,
  };
}

function fetchReleasesJson() {

  var details = {
    'email':'varunram1@musicoin.org',
    'accessToken': '5ca0c527aa324d5231ab84490ee492d03def5195999435904554b67eb79b146195f8da55e2c22f77',
    'limit': '10',
  };

  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return fetch('http://35.232.77.81:3000/release/recent?' + formBody, {
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