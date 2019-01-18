import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import Layout from '../constants/Layout';
import Colors from '../constants/Colors';
import {secondsToMinutesAndSeconds} from '../tools/util';
import {Slider} from 'react-native-elements';

class TrackSlider extends TrackPlayer.ProgressComponent {

  render() {
    return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: Layout.isSmallDevice ? 0 : 50}}>
          <View style={{width: 50, paddingHorizontal: 5, alignItems: 'center'}}>
            <Text style={{color: Colors.fontColor, fontSize: 10}}>{secondsToMinutesAndSeconds(this.state.position)}</Text>
          </View>
          <View style={{flex: 1}} ref="slider">
            <TouchableWithoutFeedback onPressIn={this.tapSliderHandler}>
              <Slider
                  trackStyle={{
                    height: 3,
                    borderRadius: 1,
                  }}
                  thumbStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 10 / 2,
                    backgroundColor: Colors.tintColor,
                  }}
                  value={this.state.position}
                  minimumValue={0}
                  maximumValue={this.state.duration}
                  onSlidingComplete={(value) => this.setNewPosition(value)}
                  onSlidingStart={(value) => this.setNewPosition(value)}
                  minimumTrackTintColor={Colors.tintColor}
                  maximumTrackTintColor={Colors.fontColor}
                  thumbTintColor={Colors.tintColor}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={{width: 50, paddingHorizontal: 5, alignItems: 'center'}}>
            <Text style={{color: Colors.fontColor, fontSize: 10}}>{secondsToMinutesAndSeconds(this.state.duration)}</Text>
          </View>
        </View>
    );
  }

  async setNewPosition(newValue) {
    await TrackPlayer.seekTo(newValue);
  }

  tapSliderHandler = (evt) => {
    //ToDo: fix tapping on the slider to change the value
    // this.refs.slider.measure((fx, fy, width, height, px, py) => { this.setNewPosition((evt.nativeEvent.locationX - px) / width); });
  };

}

export default TrackSlider;