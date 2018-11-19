import {AsyncStorage, Platform, AppState} from 'react-native';
import {API_EMAIL, API_ENDPOINT} from 'react-native-dotenv';

const ACCESS_TOKEN = 'ACCESS_TOKEN';

let token;

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }

  token = await AsyncStorage.getItem(ACCESS_TOKEN);
  return token;
};

export const setToken = (newToken) => {
  token = newToken;
  return AsyncStorage.setItem(ACCESS_TOKEN, newToken);
};

export async function fetchGetData(action, params) {
  try {
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
    }).then(response => {
      return response.json();
    }).catch(e => {
      console.log(e);
    });
  } catch (e) {
    console.log(e);
  }
}

export async function fetchPostData(action, params) {
  try {
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
      body: formBody,
    }).then(response => {
      return response.json();
    }).catch(e => {
      console.log(e);
    });
  } catch (e) {
    console.log(e);
  }
}