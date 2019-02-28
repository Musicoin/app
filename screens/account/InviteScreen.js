import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Platform, Dimensions, ScrollView, Clipboard} from 'react-native';
import Colors from '../../constants/Colors';
import {Icon} from 'expo';
import {getStatusBarHeight} from 'react-native-iphone-x-helper/index';
import {connect} from 'react-redux';

var {width} = Dimensions.get('window');

class InviteScreen extends React.Component {
  state = {
    result: null,
    showPassword: false,
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  };

  render() {
    return (
        <ScrollView style={styles.container}>
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
                <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 18}}>Invite friends</Text>
              </View>
            </View>
          </View>
          <View style={{alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 16, marginTop: 24}}>
            <Text style={{color: Colors.disabled, fontSize: 14, textAlign: 'center'}}>You have 5 invites left</Text>

            <View style={{marginTop: 24, alignItems: 'center', justifyContent: 'center'}}>
              <Image resizeMode={'contain'} style={{width: 137, height: 115, padding: 0}} source={require('../../assets/images/invite.png')}/>
            </View>
            <Text style={{color: Colors.tintColor, fontSize: 16, textAlign: 'center', marginTop: 16}}>Invite your friends to join Musicoin!</Text>

            <Text style={{color: Colors.disabled, fontSize: 12, textAlign: 'center', marginTop: 16, marginHorizontal: 32}}>
              Your referral link is reusable! When some one signs up with your referral link, your invites remaining will go down by one and you will get your reward.
            </Text>

            <Text style={{color: Colors.disabled, fontSize: 12, textAlign: 'center', marginTop: 16}}>Your invitation code:</Text>

            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B0C0D', marginTop: 16, padding: 16}}>
              <Text style={{color: Colors.tintColor, fontSize: 10, textAlign: 'center'}}>[https://musicoin.org/accept/MUSIC50f20dd3ac8...]</Text>
              <TouchableOpacity
                  onPress={() => Clipboard.setString('[https://musicoin.org/accept/MUSIC50f20dd3ac8...]')}
                  style={{justifyContent: 'center', marginHorizontal: 8}}>
                <Icon.Ionicons
                    name={Platform.OS === 'ios' ? `md-albums` : 'md-albums'}
                    size={12}
                    color={Colors.fontColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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

export default connect(mapStateToProps, {})(InviteScreen);