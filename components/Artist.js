import React, {Component} from 'react';
import {View, Text, Platform, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'expo';
import {connect} from 'react-redux';
import {playTrack, addToQueue, removeFromQueue, addAlert} from '../actions';
import Colors from '../constants/Colors';
import NavigationService from '../services/NavigationService';

class Artist extends Component {

  render() {
    let item = this.props.artist;
    return (
        <View style={styles.container}>
          <TouchableOpacity style={styles.albumArtContainer} onPress={() => NavigationService.navigate('ArtistScreen', {artist: item})}>
            <Image imageResizeMode={'cover'} style={{width: 56, height: 56, borderRadius: 28}} source={{uri: item.imageUrl}}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.artistInfoContainer} onPress={() => NavigationService.navigate('ArtistScreen', {artist: item})}>
            <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 14}}>{item.name}</Text>
            <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{item.releaseCount} {item.releaseCount == 1 ? 'release' : 'releases'}</Text>
          </TouchableOpacity>

          <View style={styles.individualPlayerButton}>
            <TouchableOpacity style={{padding: 20}} onPress={() => this.props.addAlert('info', 'More options coming soon!', '')}>
              <Icon.Ionicons
                  name={Platform.OS === 'ios' ? 'md-more' : 'md-more'}
                  size={22}
                  color={Colors.fontColor}
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
  container: {
    flexDirection: 'row',
  },
  albumArtContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  artistInfoContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  individualPlayerButton: {
    justifyContent: 'center',
  },
  playerButton: {},
});

export default connect(mapStateToProps, {playTrack, addToQueue, removeFromQueue, addAlert})(Artist);