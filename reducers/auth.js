import {RECEIVE_ACCESS_TOKEN, RECEIVE_LOGIN_INFO} from '../constants/Actions';

export default function auth(state = null, action) {
  switch (action.type) {
    case RECEIVE_ACCESS_TOKEN:
      return {...state, accessToken: action.accessToken};
    case RECEIVE_LOGIN_INFO:
      return action.data.accessToken && action.data.clientSecret ? action.data : state;
    default:
      return state;
  }
}