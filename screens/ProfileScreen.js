import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform, Dimensions} from 'react-native';
import {Icon} from 'expo';
import Colors from '../constants/Colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper/index';
import Layout from '../constants/Layout';
import {connect} from 'react-redux';
import {logout} from '../actions';

class ProfileScreen extends React.Component {
  state = {
    result: null,
  };

  render() {
    return (
        <View style={[styles.container, {marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}]}>
          <View style={{backgroundColor: Colors.tabBar, paddingVertical: 16}}>
            <Text style={{color: Colors.fontColor, alignSelf: 'center', fontSize: 18}}>Profile</Text>
          </View>
          {this.props.auth.loggedIn ?
              <View>
                <View style={{flexDirection: 'row', backgroundColor: '#3C4146', height: 80, alignItems: 'center', paddingHorizontal: 16}}>
                  {true == false ?
                      <Image style={{width: Layout.isSmallDevice ? 40 : 80, height: Layout.isSmallDevice ? 40 : 80, borderRadius: Layout.isSmallDevice ? 20 : 40, marginRight: 8}} source={{uri: this.props.profile.avatar}}/>
                      :
                      <View style={{width: Layout.isSmallDevice ? 40 : 80, height: Layout.isSmallDevice ? 40 : 80, borderRadius: Layout.isSmallDevice ? 20 : 40, backgroundColor: Colors.backgroundColor, marginRight: 8, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon.Ionicons
                            name={Platform.OS === 'ios' ? 'ios-person' : 'ios-person'}
                            size={20}
                            color={Colors.disabled}
                            style={{}}
                        />
                      </View>
                  }
                  <Text style={{color: Colors.fontColor, fontSize: 14}}>{this.props.profile.username}</Text>
                </View>
                <View style={{marginTop: 24, paddingHorizontal: 16}}>

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', width: '100%'}} onPress={() => this.props.navigation.navigate("Wallet")}>
                    <Icon.Ionicons
                        name={Platform.OS === 'ios' ? 'md-wallet' : 'md-wallet'}
                        size={20}
                        color={Colors.disabled}
                        style={{marginRight: 16}}
                    />

                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text style={{flex: 1, fontSize: 14}}>Wallet</Text>
                      <Text style={{flex: 1, fontSize: 14, color: Colors.tintColor}}>$MUSIC {this.props.profile.balance}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate("Invite")}>
                    <Icon.Ionicons
                        name={Platform.OS === 'ios' ? 'ios-gift' : 'ios-gift'}
                        size={20}
                        color={Colors.disabled}
                        style={{marginRight: 16}}
                    />

                    <Text style={{fontSize: 14}}>Invite friends</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this.props.logout()}>
                    <Icon.Ionicons
                        name={Platform.OS === 'ios' ? 'md-log-out' : 'md-log-out'}
                        size={20}
                        color={Colors.disabled}
                        style={{marginRight: 16}}
                    />

                    <Text style={{fontSize: 14}}>Logout</Text>
                  </TouchableOpacity>

                </View>
              </View>
              :
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={{color: Colors.tintColor, fontSize: 16}}>Login</Text>
                </TouchableOpacity>
              </View>
          }
        </View>
    );
  }

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(true),
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});

export default connect(mapStateToProps, {logout})(ProfileScreen);