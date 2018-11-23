import {ADD_ALERT, DELETE_ALERT} from '../constants/Actions';

export default function alert(state = null, action) {
  switch (action.type) {
    case ADD_ALERT: {
      return action.alert;
    }
    case DELETE_ALERT:
      return null;
    default:
      return state;
  }
}
