import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'expo';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import PlayerScreen from '../screens/PlayerScreen';
import DetailsScreen from '../screens/DetailsScreen';

import Colors from '../constants/Colors';
import {Platform} from 'react-native';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  headerStyle:
      {
        backgroundColor: Colors.backgroundColor,
      },
};

const RootStack = createStackNavigator(
    {
      Home: {
        screen: HomeStack,
      },
      ReleaseDetail: {
        screen: DetailsScreen,
      },
    },
    {
      mode: 'modal',
      headerMode: 'none',
    },
);

export default RootStack;
