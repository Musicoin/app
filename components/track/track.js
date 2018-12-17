import React, {Component} from 'react';
import {View, Text, Platform, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'expo';
import {connect} from 'react-redux';
import {playTrack, addToQueue, removeFromQueue} from '../../actions';
import Colors from '../../constants/Colors';

class Track extends Component {

  render() {
    let item = this.props.track;
    let origin = this.props.origin;
    return (
        <View style={styles.trackContainer}>
          <TouchableOpacity style={styles.albumArtContainer} onPress={() => this.props.playTrack(item)}>
            <Image style={{width: 56, height: 56}} source={{uri: item.trackImg}}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.releaseTrackContainer} onPress={() => this.props.playTrack(item)}>
            <Text numberOfLines={1} style={{color: Colors.fontColor}}>{item.title}</Text>
            <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{item.author}</Text>
            <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{item.directTipCount} {item.directTipCount == 1 ? 'tip' : 'tips'}</Text>
          </TouchableOpacity>

          {origin !== 'queue' ?
              <View style={styles.individualPlayerButton}>
                <TouchableOpacity style={{padding: 20}} onPress={() => this.props.addToQueue(item)}>
                  <Icon.Ionicons
                      name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
                      size={22}
                      color={Colors.fontColor}
                      style={styles.playerButton}
                  />
                </TouchableOpacity>
              </View>
              :
              <View style={styles.individualPlayerButton}>
                <TouchableOpacity style={{padding: 20}} onPress={() => this.props.removeFromQueue(item.queueId)}>
                  <Icon.Ionicons
                      name={Platform.OS === 'ios' ? 'ios-remove' : 'md-remove'}
                      size={22}
                      color={Colors.fontColor}
                      style={styles.playerButton}
                  />
                </TouchableOpacity>
              </View>
          }
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
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  releaseTrackContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  individualPlayerButton: {
    justifyContent: 'center',
  },
  playerButton: {},
});

export default connect(mapStateToProps, {playTrack, addToQueue, removeFromQueue})(Track);