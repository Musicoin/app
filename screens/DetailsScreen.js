import React from 'react';
import {ScrollView, View, Text, Button, Image, Platform, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, StatusBar} from 'react-native';
import {Icon} from 'expo';
import Colors from '../constants/Colors';
import {connect} from 'react-redux';
import Layout from '../constants/Layout';
import TextTicker from 'react-native-text-ticker';
import { getStatusBarHeight } from 'react-native-iphone-x-helper'

var {width} = Dimensions.get('window');

class DetailsScreen extends React.Component {

  render() {
    const {navigation} = this.props;
    const trackAddress = navigation.getParam('trackAddress', null);
    const origin = navigation.getParam('origin', null);
    let track = {};
    switch (origin) {
      case 'search':
        track = this.props.searchResults.releases.find(obj => obj.trackAddress === trackAddress);
        break;
      case 'new':
        track = this.props.releases.find(obj => obj.trackAddress === trackAddress);
        break;
      case 'genre':
        track = this.props.searchResultsByGenre.find(obj => obj.trackAddress === trackAddress);
        break;
      case 'queue':
        track = this.props.queue.find(obj => obj.trackAddress === trackAddress);
        break;
      case 'artist':
        track = this.props.searchResultsByArtist.find(obj => obj.trackAddress === trackAddress);
        break;
      case 'recent':
        track = this.props.lastPlayed.find(obj => obj.trackAddress === trackAddress);
        break;
      case 'tip':
        track = this.props.lastTipped.find(obj => obj.trackAddress === trackAddress);
        break;
      default:
        track = this.props.currentTrack;
        break;
    }
    return (
        <ScrollView style={{flex: 1, backgroundColor: '#272D33', paddingHorizontal: 0, paddingTop:getStatusBarHeight(true), marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}}>

          <View style={{alignItems: 'center', marginTop: 10, marginBottom: 20}}>

            <View style={{paddingHorizontal: 16, paddingVertical: 16, width: width}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{justifyContent: 'center'}}>
                  <Icon.Ionicons
                      name={Platform.OS === 'ios' ? `md-arrow-back` : 'md-arrow-back'}
                      size={20}
                      color={Colors.fontColor}
                  />
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}>
                  <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 18}}>{track.title} - {track.artistName}</Text>
                </View>
              </View>

            </View>
            <View style={{width: width, backgroundColor: Colors.backgroundColor}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image style={{width: 64, height: 64, margin: 16}} source={{uri: track.trackImg}}/>
                <View style={{paddingVertical: 16}}>
                  <TextTicker
                      style={{color: Colors.tintColor, fontSize: 16, marginVertical: 2}}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={1000}
                  >
                    {track.title}
                  </TextTicker>
                  <TextTicker
                      style={{color: '#8897A2', fontSize: 12,marginVertical: 2}}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={1000}
                  >
                    {track.artistName}
                  </TextTicker>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.infoContainer}>

            <View style={{marginTop: 16}}>
              <Text style={{flex: 1, fontSize: 14, color: '#8897A2'}}>Plays: {track.directPlayCount}</Text>
            </View>
            <View style={{marginTop: 16}}>
              <Text style={{flex: 1, fontSize: 14, color: '#8897A2'}}>Tips: {track.directTipCount}</Text>
            </View>
            {track.genres != [] ?
                <View style={{marginTop: 16}}>
                  <Text style={{flex: 1, fontSize: 14, color: '#8897A2'}}>Genres</Text>
                  <Text style={{color: Colors.fontColor, fontSize: 10, marginTop: 8}}>{track.genres.join(', ')}</Text>
                </View> : null}

            <View style={{marginTop: 16}}>
              <Text style={{flex: 1, fontSize: 14, color: '#8897A2'}}>Description</Text>
              <Text style={{color: Colors.fontColor, fontSize: 10, marginTop: 8}}>{track.trackDescription}</Text>
            </View>

          </View>

        </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: '#272D33',
    paddingHorizontal: 16,
    marginBottom: 30,
  },
});

export default connect(mapStateToProps, {})(DetailsScreen);

