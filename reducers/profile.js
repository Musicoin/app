import {PROFILE_SUCCESS, RECEIVE_ANONYMOUS_LOGIN_INFO, LOG_OUT} from '../constants/Actions';

export default function profile(state = {}, action) {
  switch (action.type) {
    case PROFILE_SUCCESS:
      return {...action.data};
    case RECEIVE_ANONYMOUS_LOGIN_INFO:
    case LOG_OUT:
      return {};
    default:
      return state;
  }
}