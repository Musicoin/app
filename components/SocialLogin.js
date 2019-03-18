import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AuthSession, Icon} from 'expo';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import {socialLogin, fetchTwitterOauthToken} from '../actions';
import {FB_APP_ID, GOOGLE_APP_ID} from 'react-native-dotenv';

class SocialLogin extends React.Component {

  render() {
    return (
        <View>
          <Text style={{color: Colors.disabled, fontSize: 12, marginTop: 16, textAlign: 'center'}}>or, use another account:</Text>

          <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 32}}>
            <TouchableOpacity
                style={{backgroundColor: '#EA4335', marginHorizontal: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 3}}
                onPress={() => this._handleGoogleSignin()}>
              <Icon.FontAwesome
                  name={'google'}
                  size={20}
                  color={Colors.fontColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
                style={{backgroundColor: '#1DA1F2', marginHorizontal: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 3}}
                onPress={() => this._handleTwitterSignin()}>
              <Icon.FontAwesome
                  name={'twitter'}
                  size={20}
                  color={Colors.fontColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
                style={{backgroundColor: '#3B5998', marginHorizontal: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 3}}
                onPress={() => this._handleFacebookSignin()}>
              <Icon.FontAwesome
                  name={'facebook-square'}
                  size={20}
                  color={Colors.fontColor}
              />
            </TouchableOpacity>
          </View>
        </View>
    );
  }

  _handleGoogleSignin = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    let result = await AuthSession.startAsync({
      authUrl:
      //google
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `&client_id=${GOOGLE_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
      `&response_type=token` +
      `&scope=${encodeURIComponent('profile email openid')}` +
      `&behavior=web`,
    });
    this.setState({result});
    if (result.params && result.params.access_token) {
      this.props.socialLogin('google', result.params.access_token);
    }
  };

  _handleFacebookSignin = async () => {
    let redirectUrl = AuthSession.getRedirectUrl();
    let result = await AuthSession.startAsync({
      authUrl:
      `https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
      `&client_id=${FB_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
    });
    this.setState({result});
    console.log(result.params.access_token);
    if (result.params && result.params.access_token) {
      this.props.socialLogin('facebook', result.params.access_token);
    }
  };

  _handleTwitterSignin = async () => {
    let tokenRequest = await fetchTwitterOauthToken();
    console.log(tokenRequest.oauthToken);
    if (tokenRequest.oauthToken) {
      let redirectUrl = AuthSession.getRedirectUrl();
      let result = await AuthSession.startAsync({
        authUrl:
        `https://api.twitter.com/oauth/authenticate?oauth_token=${tokenRequest.oauthToken}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
      });
      this.setState({result});
      console.log(result);
      if (result.params && result.params.oauth_verifier) {
        this.props.socialLogin('twitter', "", result.params.oauth_token, result.params.oauth_verifier);
      }
    }
  };

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({});

export default connect(mapStateToProps, {socialLogin})(SocialLogin);
