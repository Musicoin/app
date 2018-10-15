import React from 'react';
import {View, Text, Button, Image} from 'react-native';
import Colors from '../constants/Colors';

export default class DetailsScreen extends React.Component {
  static navigationOptions = {};

  render() {
    const {navigation} = this.props;
    const track = navigation.getParam('track', null);
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.backgroundColor}}>
          <Image style={{width: 300, height: 300}} source={require('../assets/images/albumart.png')}/>
          <Text style={{fontSize: 30, color: Colors.fontColor}}>{track.title}</Text>
          <Text style={{color: Colors.fontColor}}>{track.trackDescription}</Text>
          <Button
              onPress={() => this.props.navigation.goBack()}
              title="Dismiss"
          />
        </View>
    );
  }
}
