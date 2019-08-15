import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import ReactoTron from '../ReactotronConfig';

import rootReducer from '../reducers';

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2,
  version: 1,
  debug: true,
  whitelist: ['queue', 'settings', 'currentTrack', 'releases', 'auth', 'lastPlayed', 'profile', 'lastTipped', 'artistOfTheWeek'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, compose(applyMiddleware(thunk), ReactoTron.createEnhancer()));

const persistor = persistStore(store);

export {store, persistor};
