import React from 'react';
import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {playTrack} from '../actions';
import {LinearGradient} from 'expo';
import Colors from '../constants/Colors';
import {Button} from 'react-native-elements';
import {Icon} from 'expo';

class ArtistOfTheWeek extends React.Component {
  render() {
    return (
        <View style={styles.container}>
          <LinearGradient
              colors={['rgba(243, 146, 27, 0.5)', 'rgba(26, 29, 33, 0.5)']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 168,
                borderRadius: 10,
              }}
          >
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <Image style={{width: 136, height: 136, margin: 16, alignSelf: 'flex-start'}} source={{uri: 'https://musicoin.org/media/cf3920c7afd5c96a689e3980e11a26c4d668de790f0d79ca6d0f86c8bea85eb06019415992f81356227e1c0bb852'}}/>
              <View style={{margin: 16, alignItems: 'flex-end'}}>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>Artist of the week</Text>
                <Text style={{fontSize: 14, fontFamily: 'robotoMedium', marginTop: 16}}>Waves Of Decay</Text>
                <Text style={{fontSize: 14}}>The Hurricane</Text>
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
                      borderRadius: Platform.OS === 'ios' ? 20 : 0,
                      paddingHorizontal: 24,
                    }}
                    titleStyle={{fontSize: 12, color: Colors.fontColor, fontWeight: 'bold'}}
                    containerStyle={{marginTop: 20}}
                    onPress={() => console.log('To be added')}
                />
              </View>
            </View>
          </LinearGradient>
        </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    height: 168,
    borderRadius: 10,
    margin: 16,
  },
});

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, {playTrack})(ArtistOfTheWeek);