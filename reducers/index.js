import {combineReducers} from 'redux';
import {RECEIVE_RELEASES, RECEIVE_ACCESS_TOKEN} from '../actions';

function releases(state = [], action) {
  switch (action.type) {
    case RECEIVE_RELEASES:
      return action.releases? action.releases:state;
    default:
      return state;
  }
}

function accessToken(state = {}, action){
  switch(action.type){
    case RECEIVE_ACCESS_TOKEN:
      return action.accessToken?action.accessToken:state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({releases, accessToken});

export default rootReducer;