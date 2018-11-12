import React from 'react';
import {Platform, Text, StatusBar, StyleSheet, View} from 'react-native';
import TabBarIcon from './components/TabBarIcon';

import {AppLoading, Asset, Font, Icon} from 'expo';
import Colors from './constants/Colors';
import AppNavigator from './navigation/AppNavigator';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import AlertProvider from './components/alert/alert.component';

import {fetchReleases, fetchAccessToken} from './actions';

const store = createStore(rootReducer, applyMiddleware(thunk));
store.subscribe(() => console.log('store', store.getState()));
store.dispatch(fetchAccessToken()).then(() => store.dispatch(fetchReleases()));

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  componentDidMount() {
    // this.interval = setInterval(() => {
    //   store.dispatch(fetchReleases());
    //   console.log('refresh releases');
    // }, 120000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
          <AppLoading
              startAsync={this._loadResourcesAsync}
              onError={this._handleLoadingError}
              onFinish={this._handleFinishLoading}
          />
      );
    } else {
      return (
          <Provider store={store}>
            <AlertProvider>
              <View style={styles.songInfoContainer}>
                <StatusBar barStyle="light-content"/>
                <AppNavigator/>
              </View>
            </AlertProvider>
          </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true});
  };
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});
