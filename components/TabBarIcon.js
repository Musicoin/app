import React from 'react';
import {View} from 'react-native';
import * as Icon from '@expo/vector-icons';

import Colors from '../constants/Colors';

export default class TabBarIcon extends React.Component {
  render() {
    let iconFamily = 'ionicons';
    if (this.props.iconFamily) {
      iconFamily = this.props.iconFamily;
    }
    let tabIcon;
    switch(iconFamily){
      case 'material':
        tabIcon = <Icon.MaterialIcons
            name={this.props.name}
            size={26}
            style={{marginBottom: -3}}
            color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />;
        break;
      default:
        tabIcon = <Icon.Ionicons
            name={this.props.name}
            size={26}
            style={{marginBottom: -3}}
            color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
        />;
    }

    return (
        <View>{tabIcon}</View>
    );
  }

}