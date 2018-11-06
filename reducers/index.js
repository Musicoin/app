import {combineReducers} from 'redux';
import {RECEIVE_RELEASES, RECEIVE_ACCESS_TOKEN, TIP_TRACK, ADD_ALERT, DELETE_ALERT} from '../actions';

function releases(state = [], action) {
  switch (action.type) {
    case RECEIVE_RELEASES:
      return action.releases ? action.releases : state;
    case TIP_TRACK: {
      //update tip count in store
      return state.map((item, index) => {
        if (item.trackId !== action.trackId) {
          // This isn't the item we care about - keep it as-is
          return item;
        }

        // Otherwise, this is the one we want - return an updated value
        return {
          ...item,
          directTipCount: item.directTipCount + 1,
        };
      });
    }
    default:
      return state;
  }
}

function accessToken(state = {}, action) {
  switch (action.type) {
    case RECEIVE_ACCESS_TOKEN:
      return action.accessToken ? action.accessToken : state;
    default:
      return state;
  }
}

function alert(state = null, action) {
  console.log(action);
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

const rootReducer = combineReducers({releases, accessToken, alert});

export default rootReducer;