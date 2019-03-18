import {combineReducers} from 'redux';

import auth from './auth';
import currentTrack from './currentTrack';
import releases from './releases';
import alert from './alert';
import lastAction from './lastAction';
import searchResults from './searchResults';
import searchResultsByGenre from './searchResultsByGenre';
import searchResultsByArtist from './searchResultsByArtist';
import loading from './loading';
import queue from './queue';
import lastPlayed from './lastPlayed';
import settings from './settings';
import artistOfTheWeek from './artistOfTheWeek';
import profile from './profile';
import lastTipped from './lastTipped';

const rootReducer = combineReducers({
  releases,
  auth,
  alert,
  lastAction,
  currentTrack,
  searchResults,
  searchResultsByGenre,
  searchResultsByArtist,
  loading,
  queue,
  lastPlayed,
  settings,
  artistOfTheWeek,
  profile,
  lastTipped,
});

export default rootReducer;