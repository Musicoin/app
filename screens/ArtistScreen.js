import React from 'react';
import {ScrollView, View, Text, Button, Image, Platform, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, StatusBar} from 'react-native';
import {Icon} from 'expo';
import Colors from '../constants/Colors';
import {connect} from 'react-redux';
import Layout from '../constants/Layout';

var {width} = Dimensions.get('window');

class ArtistScreen extends React.Component {

  render() {
    const {navigation} = this.props;
    const artist = navigation.getParam('artist', null);

    return (
        <ScrollView style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingHorizontal: 0, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, paddingBottom: 20, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}}>

          <View style={{paddingHorizontal: 10, paddingTop: 20, paddingBottom: 50, backgroundColor: '#272D33'}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon.Ionicons
                  name={Platform.OS === 'ios' ? `ios-arrow-back` : 'md-arrow-back'}
                  size={26}
                  color={Colors.fontColor}
              />
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'center', marginBottom: 20, paddingVertical: 5, paddingTop: 10}}>
              <Image style={{width: 104, height: 104, borderRadius: 52}} source={{uri: artist.imageUrl}}/>
              <Text style={{fontSize: 16, color: Colors.fontColor, paddingTop: 8}}>{artist.name}</Text>
              <View style={{flex: 1, flexDirection: 'row', marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
                <Icon.Ionicons
                    name={Platform.OS === 'ios' ? 'md-disc' : 'md-disc'}
                    size={12}
                    color={Colors.fontColor}
                    style={{margin: 5}}
                />
                <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{artist.releaseCount} {artist.releaseCount == 1 ? 'release' : 'releases'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoContainer}>
            <Text style={{color: Colors.fontColor}}>[RELEASES]</Text>

          </View>

        </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0,0.3)',
    height: width,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginTop: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect(mapStateToProps, {})(ArtistScreen);

