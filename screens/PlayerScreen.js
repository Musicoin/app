import React from 'react';
import {Text, Button, ScrollView, StyleSheet} from 'react-native';
import {ExpoLinksView} from '@expo/samples';

const soundObject = new Expo.Audio.Sound();
const source = {uri: 'https://a.musicoin.org/tracks/0x8c6cf658952d77c04de98c8a94c7b3b78d785b9f/index.m3u8'};
const initialStatus = {};

let onPlaybackStatusUpdate = function(playbackstatus){
};

soundObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

export default class PlayerScreen extends React.Component {

  static navigationOptions = {
    title: 'Player',
  };

  constructor(props){
    super(props);
  }

  render() {
    return (
        <ScrollView>
          <Button
              onPress={()=>this.playAudio()}
              title="Play"
              color="#841584"
          />
          <Button
              onPress={()=>this.pauseAudio()}
              title="Pause"
              color="#841584"
          />
        </ScrollView>
    );
  }

  async playAudio(){

    await soundObject.loadAsync(source, initialStatus, false);
    await soundObject.playAsync();
  }

  async pauseAudio(){
    await soundObject.pauseAsync();
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
