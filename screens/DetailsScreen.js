import React from 'react';
import {ScrollView, View, Text, Button, Image, Platform, TouchableOpacity} from 'react-native';
import {Icon} from 'expo';
import Colors from '../constants/Colors';

export default class DetailsScreen extends React.Component {

  render() {
    const {navigation} = this.props;
    const track = navigation.getParam('track', null);
    return (
        <ScrollView style={{flex: 1, backgroundColor: Colors.backgroundColor, padding: 10}}>
          <View style={{flexDirection: 'row', backgroundColor: Colors.backgroundColor, margin: 0, paddingTop: 20}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon.Ionicons
                  name={Platform.OS === 'ios' ? `ios-arrow-back` : 'md-arrow-back'}
                  size={26}
                  color={Colors.fontColor}
              />
            </TouchableOpacity>
            <Text numberOfLines={1} style={{flex: 1, fontSize: 20, color: Colors.fontColor, textAlign: 'center', paddingLeft: 10, paddingRight: 10}}>{track.author} - {track.title}</Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image style={{width: 300, height: 300, marginTop: 10}} source={require('../assets/images/albumart.png')}/>

            <Text numberOfLines={1} style={{color: Colors.fontColor}}>{track.directPlayCount?track.directPlayCount:0} PPP & {track.directTipCount?track.directTipCount:0} Tips</Text>

            <TouchableOpacity style={{paddingTop: 10}} onPress={() => console.log('to be implemented')}>
              <Icon.Ionicons
                  name={Platform.OS === 'ios' ? `ios-heart` : 'md-heart'}
                  size={60}
                  color={'red'}
              />
            </TouchableOpacity>

            <Text style={{color: Colors.fontColor, fontSize: 14}}>Genres: {track.genres.join()}</Text>

            <Text style={{color: Colors.fontColor, fontSize: 12, paddingTop: 10}}>{track.trackDescription}</Text>
          </View>
        </ScrollView>
    );
  }
}
