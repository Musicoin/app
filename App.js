import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {setCustomText} from 'react-native-global-props';

import {AppLoading, Asset, Font, Icon} from 'expo';
import Colors from './constants/Colors';
import AppNavigator from './navigation/AppNavigator';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './store';

import AlertProvider from './components/alert/alert.component';
import PlayerComponent from './components/Player';

import NavigationService from './services/NavigationService';

import {fetchReleases, fetchAccessToken} from './actions';

store.subscribe(() => console.log('store', store.getState()));
store.dispatch(fetchAccessToken()).then(() => store.dispatch(fetchReleases()));

// Setting default styles for all Text components.
const customTextProps = {
  style: {
    fontFamily: 'roboto',
    color: Colors.fontColor,
  }
};

// persistor.purge();

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
    // clearInterval(this.interval);
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
            <PersistGate loading={null} persistor={persistor}>
              <AlertProvider>
                <View style={styles.songInfoContainer}>
                  <StatusBar barStyle="light-content"/>
                  <AppNavigator ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                  }}/>
                  <PlayerComponent/>
                </View>
              </AlertProvider>
            </PersistGate>
          </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/icons/clap-grey.png'),
        require('./assets/icons/clap-white.png'),
        require('./assets/icons/library-grey.png'),
        require('./assets/icons/library-white.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'roboto': require('./assets/fonts/Roboto-Regular.ttf'),
      }),
    ]);
  };

  setComponentDefaults(){
    setCustomText(customTextProps);
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setComponentDefaults();
    this.setState({isLoadingComplete: true});
  };
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});
