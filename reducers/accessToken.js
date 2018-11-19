import {RECEIVE_ACCESS_TOKEN} from '../constants/Actions';

export default function accessToken(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ACCESS_TOKEN:
      return action.accessToken ? action.accessToken : state;
    default:
      return state;
  }
}