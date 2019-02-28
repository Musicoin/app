import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {AuthSession} from 'expo';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import {socialLogin} from '../actions';
import {FB_APP_ID, GOOGLE_APP_ID, TWITTER_APP_ID} from 'react-native-dotenv';

class SocialLogin extends React.Component {

  render() {
    return (
        <View>
          <Text style={{color: Colors.disabled, fontSize: 12, marginTop: 16, textAlign: 'center'}}>or, use another account:</Text>

          <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 32}}>
            <TouchableOpacity style={{marginHorizontal: 8}} onPress={() => this._handleGoogleSignin()}>
              <Image resizeMode={'contain'} style={{width: 40, height: 40}} source={require('../assets/icons/google.png')}/>
            </TouchableOpacity>
            {/*<TouchableOpacity style={{marginHorizontal: 8}}>*/}
              {/*<Image resizeMode={'contain'} style={{width: 40, height: 40}} source={require('../assets/icons/twitter.png')}/>*/}
            {/*</TouchableOpacity>*/}
            {/*<TouchableOpacity style={{marginHorizontal: 8}}>*/}
              {/*<Image resizeMode={'contain'} style={{width: 40, height: 40}} source={require('../assets/icons/facebook.png')}/>*/}
            {/*</TouchableOpacity>*/}
          </View>
        </View>
    );
  }

  _handleGoogleSignin = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    console.log(redirectUrl);
    let result = await AuthSession.startAsync({
      authUrl:
      //google
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `&client_id=${GOOGLE_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent('profile email openid')}` +
      `&behavior=web`,

      //facebook
      // `https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
      // `&client_id=${FB_APP_ID}` +
      // `&redirect_uri=${encodeURIComponent(redirectUrl)}`,

      //twitter
      //   `https://api.twitter.com/oauth/authenticate?oauth_token=${TWITTER_APP_ID}` +
      //   `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
    });
    this.setState({result});
    console.log(result.params.access_token);
    if (result.params.access_token) {
      this.props.socialLogin('google', result.params.access_token);
    }
  };

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({});

export default connect(mapStateToProps, {socialLogin})(SocialLogin);
