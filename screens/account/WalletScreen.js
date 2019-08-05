import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform, Dimensions, Clipboard, Linking} from 'react-native';
import Colors from '../../constants/Colors';
import * as Icon from '@expo/vector-icons';
import {getStatusBarHeight} from 'react-native-iphone-x-helper/index';
import {connect} from 'react-redux';
import {addAlert} from '../../actions/index';

var {width} = Dimensions.get('window');

class WalletScreen extends React.Component {
  state = {
    showPassword: false,
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  render() {
    return (
        <View style={styles.container}>
          <View style={{paddingHorizontal: 16, paddingVertical: 16, width: width, backgroundColor: Colors.tabBar}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{justifyContent: 'center'}}>
                <Icon.Ionicons
                    name={Platform.OS === 'ios' ? `md-arrow-back` : 'md-arrow-back'}
                    size={20}
                    color={Colors.fontColor}
                />
              </TouchableOpacity>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}>
                <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 18}}>Wallet</Text>
              </View>
            </View>
          </View>
          <View style={{alignItems: 'stretch', paddingHorizontal: 16, marginTop: 16}}>
            <Text style={{color: Colors.disabled, fontSize: 14, textAlign: 'center'}}>Your balance</Text>

            <View style={{backgroundColor: '#0B0C0D', marginTop: 8, paddingVertical: 24}}>
              <Text style={{color: Colors.tintColor, fontSize: 16, textAlign: 'center'}}>$MUSIC</Text>
              <TouchableOpacity onPress={() => {
                let url = `https://explorer.musicoin.org/account/${this.props.profile.profileAddress}`;
                Linking.canOpenURL(url).then((supported) => {
                  if (!supported) {
                    this.props.addAlert('error', '', 'Can\'t open the explorer right now, please try again at a later time.');
                  } else {
                    return Linking.openURL(url);
                  }
                }).catch((err) => {
                  console.error('An error occurred', err);
                  this.props.addAlert('error', '', 'Can\'t open the explorer right now, please try again at a later time.');
                });
              }}>
                <Text style={{color: Colors.fontColor, fontSize: 24, textAlign: 'center', marginVertical: 16}}>{this.props.profile.balance ? parseFloat(this.props.profile.balance).toFixed(2) : '0.00'}</Text>
              </TouchableOpacity>
            </View>

            {this.props.profile.profileAddress ?
                <View>
                  <Text style={{color: Colors.disabled, fontSize: 14, textAlign: 'center', marginTop: 16}}>Your wallet address</Text>

                  <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(this.props.profile.profileAddress);
                        this.props.addAlert('info', '', 'Wallet address copied!');
                      }}
                      style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0C0D', marginTop: 16, padding: 16}}>
                    <Text style={{color: Colors.tintColor, fontSize: 10, textAlign: 'center'}}>{this.props.profile.profileAddress}</Text>
                    <View style={{justifyContent: 'center', marginHorizontal: 8}}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `md-albums` : 'md-albums'}
                          size={12}
                          color={Colors.fontColor}
                      />
                    </View>
                  </TouchableOpacity>
                </View> :
                <Text style={{color: Colors.errorText, fontSize: 14, textAlign: 'center', marginTop: 16}}>No wallet address</Text>
            }
          </View>
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

export default connect(mapStateToProps, {addAlert})(WalletScreen);