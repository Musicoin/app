import {RECEIVE_ACCESS_TOKEN, RECEIVE_ANONYMOUS_LOGIN_INFO, LOG_OUT} from '../constants/Actions';

export default function auth(state = {shouldLogin: false,origin: 'anonymous', loggedIn: false}, action) {
  switch (action.type) {
    case RECEIVE_ACCESS_TOKEN:
      return action.data.clientSecret && action.data.accessToken? {shouldLogin: true, origin: action.origin, loggedIn: true, ...action.data}: state;
    case RECEIVE_ANONYMOUS_LOGIN_INFO:
      return action.data.accessToken && action.data.clientSecret ? {...state, origin: 'anonymous', loggedIn: false,...action.data} : state;
    case LOG_OUT:
      return {...state, shouldLogin: false, loggedIn: false};
    default:
      return state;
  }
}