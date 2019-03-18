import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import connectAlert from '../components/alert/connectAlert.component';
import Track from '../components/track/track';
import ArtistOfTheWeek from '../components/ArtistOfTheWeek';
import {fetchReleases, fetchArtistOfTheWeek} from '../actions';
import Layout from '../constants/Layout';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {GENERAL_API_LIMIT} from '../constants/App';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let {auth} = this.props;
    if (auth.shouldLogin && !auth.loggedIn) {
      this.props.navigation.navigate('Login');
    }
  }

  render() {
    return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingTop: getStatusBarHeight(true)}}>
          <ArtistOfTheWeek/>
          <Text style={{fontSize: 16, color: '#F4F7FB', alignSelf: 'center', paddingVertical: 5}}>Recent releases</Text>
          <FlatList
              data={this.props.releases}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl
                    refreshing={(this.props.loading.RECEIVE_NEW_RELEASES && this.props.releases.length == 0) || this.props.loading.ARTIST_OF_THE_WEEK}
                    onRefresh={() => {
                      this.props.fetchArtistOfTheWeek();
                      this.props.fetchReleases(0);
                    }}
                    tintColor={Colors.tintColor}
                />
              }
              ListEmptyComponent={!this.props.loading.RECEIVE_NEW_RELEASES ? <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: Colors.tabIconDefault}}>Something went wrong, please try again later</Text>
              </View> : null}
              ListFooterComponent={
                this.props.loading.RECEIVE_NEW_RELEASES && this.props.releases.length >= GENERAL_API_LIMIT ?
                    <ActivityIndicator size="small" color={Colors.tintColor} style={{marginTop: 10}}/> :
                    null}
              onEndReached={() => {
                !this.props.loading.RECEIVE_NEW_RELEASES && this.props.releases.length >= GENERAL_API_LIMIT ?
                    this.props.fetchReleases(this.props.releases.length) :
                    null
              }}
              initialNumToRender={5}
              onEndReachedThreshold={1.5}
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

export default connectAlert(connect(mapStateToProps, {fetchReleases, fetchArtistOfTheWeek})(HomeScreen));
