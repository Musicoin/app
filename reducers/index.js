import {combineReducers} from 'redux';
import {RECEIVE_RELEASES} from '../actions';

function releases(state = [], action) {
  switch (action.type) {
    case RECEIVE_RELEASES:
      return action.releases;
    default:
      return state;
  }
}

const rootReducer = combineReducers({releases});

export default rootReducer;