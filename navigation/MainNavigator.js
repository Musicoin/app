import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {createStackNavigator, createBottomTabNavigator} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import SearchScreen from '../screens/SearchScreen';
import LibraryScreen from '../screens/LibraryScreen';

import Colors from '../constants/Colors';
import {Platform} from 'react-native';

const HomeStack = createStackNavigator(
    {
      Home: {
        screen: HomeScreen,
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

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({focused}) => (
      <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
                ? `ios-home`
                : 'md-home'
          }
      />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tabIconSelected,
    activeBackgroundColor: Colors.backgroundColor,
    inactiveTintColor: Colors.tabIconDefault,
    inactiveBackgroundColor: Colors.backgroundColor,
  },
  headerTitle: <View style={{flex: 1, alignItems: 'center', backgroundColor: Colors.backgroundColor, margin: 0, padding: 0}}>
    <Image resizeMode={'center'} style={{width: 150, height: 35.625, margin: 0, padding: 0}} source={require('../assets/images/logo.png')}/>
  </View>,
  headerStyle:
      {
        backgroundColor: Colors.backgroundColor,
        borderBottomWidth: 0,
      },
};

const DiscoverStack = createStackNavigator(
    {
      Home: {
        screen: SearchScreen,
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

DiscoverStack.navigationOptions = {
  tabBarLabel: 'Discover',
  tabBarIcon: ({focused}) => (
      <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
                ? `ios-search`
                : 'md-search'
          }
      />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tabIconSelected,
    activeBackgroundColor: Colors.backgroundColor,
    inactiveTintColor: Colors.tabIconDefault,
    inactiveBackgroundColor: Colors.backgroundColor,
  },
  headerStyle:
      {
        backgroundColor: Colors.backgroundColor,
      },
};

const LibraryStack = createStackNavigator(
    {
      Search: {
        screen: LibraryScreen,
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

LibraryStack.navigationOptions = {
  tabBarLabel: 'Library',
  tabBarIcon: ({focused}) => (
      <TabBarIcon
          focused={focused}
          name={
            Platform.OS === 'ios'
                ? `ios-switch`
                : 'md-switch'
          }
      />
  ),
  tabBarOptions: {
    activeTintColor: Colors.tabIconSelected,
    activeBackgroundColor: Colors.backgroundColor,
    inactiveTintColor: Colors.tabIconDefault,
    inactiveBackgroundColor: Colors.backgroundColor,
  },
  headerStyle:
      {
        backgroundColor: Colors.backgroundColor,
      },
};

export default createBottomTabNavigator({HomeStack, DiscoverStack, LibraryStack});
