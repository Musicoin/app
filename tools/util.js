import {AsyncStorage, Platform, AppState} from 'react-native';

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
