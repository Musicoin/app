import React, {Component} from 'react';
import {View, Text, Platform, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'expo';
import {connect} from 'react-redux';
import {playTrack} from '../../actions';
import Colors from '../../constants/Colors';

import NavigationService from '../../services/NavigationService';

class Track extends Component {

  render() {
    let item = this.props.track;
    let origin = this.props.origin;
    return (
        <View style={styles.trackContainer}>
          <View style={styles.albumArtContainer}>
            <Image style={{width: 40, height: 40}} source={{uri: item.trackImg}}/>
          </View>

          <TouchableOpacity style={styles.releaseTrackContainer} onPress={() => NavigationService.navigate('ReleaseDetail', {trackId: item.trackId, origin})}>
            <Text numberOfLines={1} style={{color: Colors.fontColor}}>{item.title}</Text>
            <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 10}}>{item.artistName}</Text>
          </TouchableOpacity>

          <View style={styles.individualPlayerButton}>
            <TouchableOpacity onPress={() => this.props.playTrack(item)}>
              <Icon.Ionicons
                  name={Platform.OS === 'ios' ? 'ios-play' : 'md-play'}
                  size={18}
                  color={Colors.tintColor}
                  style={styles.playerButton}
              />
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  trackContainer: {
    flexDirection: 'row',
  },
  albumArtContainer: {
    padding: 10,
    flex: 0.1,
  },
  releaseTrackContainer: {
    paddingTop: 15,
    padding: 10,
    flex: 0.9,
  },
  individualPlayerButton: {
    marginRight: 10,
    paddingTop: 5,
    flex: 0.2,
  },
  playerButton: {
    padding: 10,
    marginLeft: 10,
    flex: 0.1,
  },
});

export default connect(mapStateToProps, {playTrack})(Track);