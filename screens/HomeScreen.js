import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import connectAlert from '../components/alert/connectAlert.component';
import Track from '../components/track/track';
import {tipTrack, playTrack} from '../actions';
import Layout from '../constants/Layout';

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20}}>
          <ScrollView style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}>
            {this.props.releases.length > 0 ?
                <FlatList
                    data={this.props.releases}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                : <ActivityIndicator size="small" color={Colors.tintColor}/>}
          </ScrollView>

        </View>
    );
  }

  _keyExtractor = (item, index) => item.trackId;

  _renderItem = ({item}) => (
      <Track track={item} />
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
  playerContainer: {
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

export default connectAlert(connect(mapStateToProps, {tipTrack, playTrack})(HomeScreen));
