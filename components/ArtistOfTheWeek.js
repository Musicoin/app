import React from 'react';
import {View, Text, StyleSheet, Image, Platform, TouchableWithoutFeedback} from 'react-native';
import {connect} from 'react-redux';
import {playTrack, followArtist} from '../actions';
import * as Icon from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import Colors from '../constants/Colors';
import {Button} from 'react-native-elements';
import NavigationService from '../services/NavigationService';
import Layout from '../constants/Layout';

class ArtistOfTheWeek extends React.Component {
  render() {
    return (
        this.props.artistOfTheWeek ?
            <View style={styles.container}>
              <TouchableWithoutFeedback onPress={() => NavigationService.navigate('ArtistScreen', {artist: this.props.artistOfTheWeek.artist})}>
                <LinearGradient
                    colors={['rgba(243, 146, 27, 0.5)', 'rgba(26, 29, 33, 0.5)']}
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      height: 152,
                      width: Layout.window.width,
                      alignItems: 'center',
                    }}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center', width: Layout.isSmallDevice ? Layout.window.width : 400}}>
                    <Image style={{width: 120, height: 120, margin: 16}} source={{uri: this.props.artistOfTheWeek.track.trackImg}}/>
                    <View style={{margin: 8, marginLeft: 0, width: Layout.isSmallDevice ? Layout.window.width / 2 : 200}}>
                      <Text numberOfLines={1} style={{fontSize: 14, fontWeight: 'bold'}}>Artist of the week</Text>
                      <Text numberOfLines={1} style={{fontSize: 12, fontFamily: 'robotoMedium', marginTop: 8}}>{this.props.artistOfTheWeek.artist.artistName}</Text>
                      <Text numberOfLines={1} style={{fontSize: 12}}>{this.props.artistOfTheWeek.track.title}</Text>
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Button
                            icon={
                              <Icon.Ionicons
                                  name={Platform.OS === 'ios' ? 'ios-play' : 'md-play'}
                                  size={14}
                                  color={Colors.fontColor}
                              />
                            }
                            title='PLAY'
                            buttonStyle={{
                              backgroundColor: Colors.tintColor,
                              borderColor: 'transparent',
                              borderWidth: 0,
                              paddingHorizontal: 12,
                              paddingVertical: 0,
                              maxWidth: 100,
                              marginRight: 4,
                            }}
                            titleStyle={{fontSize: 10, color: Colors.fontColor, fontWeight: 'bold'}}
                            containerStyle={{marginTop: 20}}
                            onPress={() => this.props.playTrack(this.props.artistOfTheWeek.track, true)}
                        />
                        <Button
                            title={this.props.artistOfTheWeek.artist.followed ? 'Following' : 'Follow'}
                            buttonStyle={{
                              backgroundColor: 'transparent',
                              borderColor: Colors.tintColor,
                              borderWidth: 1,
                              paddingHorizontal: 12,
                              paddingVertical: 0,
                              maxWidth: 100,
                              marginHorizontal: 4,
                            }}
                            titleStyle={{fontSize: 10, color: Colors.tintColor, fontWeight: 'bold'}}
                            containerStyle={{marginTop: 20}}
                            onPress={() => this.props.followArtist(this.props.artistOfTheWeek.artist, this.props.artistOfTheWeek.artist.followed ? false : true)}
                        />
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableWithoutFeedback>
            </View> : null
    );

  }
}

const styles = StyleSheet.create({
  container: {
    width: Layout.isSmallDevice ? Layout.window.width : 400,
    height: 152,
  },
});

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, {playTrack, followArtist})(ArtistOfTheWeek);