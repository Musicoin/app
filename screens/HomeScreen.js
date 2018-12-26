import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  RefreshControl,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import connectAlert from '../components/alert/connectAlert.component';
import Track from '../components/track/track';
import {fetchReleases} from '../actions';
import Layout from '../constants/Layout';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingTop: getStatusBarHeight(true)}}>
          <FlatList
              data={this.props.releases}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl
                    refreshing={this.props.loading.RECEIVE_NEW_RELEASES}
                    onRefresh={() => this.props.fetchReleases()}
                    tintColor={Colors.tintColor}
                />
              }
              ListEmptyComponent={!this.props.loading.RECEIVE_NEW_RELEASES ? <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: Colors.tabIconDefault}}>Something went wrong, please try again later</Text>
              </View> : null}
          />
        </View>
    );
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <Track track={item} origin="new"/>
  );

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentContainer: {
    paddingTop: 0,
  },
  playButtonContainer: {
    padding: 0,
    margin: 0,
    flex: 0.1,
  },
  smallPlayerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 5,
  },
  albumArtPlayerContainer: {
    padding: 10,
    flex: 0.3,
  },
  songInfo: {
    padding: 10,
    marginRight: 10,
    flex: 0.6,
  },
});

export default connectAlert(connect(mapStateToProps, {fetchReleases})(HomeScreen));
