package host.exp.exponent;


import com.facebook.react.ReactApplication;
import com.guichaguri.trackplayer.TrackPlayer;
import com.dooboolab.RNIap.RNIapPackage;
import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;

import okhttp3.OkHttpClient;

// Needed for `react-native link`
// import com.facebook.react.ReactApplication;

import com.facebook.react.ReactNativeHost;

import org.unimodules.core.interfaces.Package;
import host.exp.exponent.generated.BasePackageList;

public class MainApplication extends ExpoApplication implements ReactApplication {

  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    public boolean getUseDeveloperSupport() {
      return true;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new TrackPlayer()
      );
    }
  };

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  // Needed for `react-native link`
  public List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        // Add your own packages here!
        // TODO: add native modules!

        // Needed for `react-native link`
        // new MainReactPackage(),
            new TrackPlayer(),
            new RNIapPackage()
    );
  }

  @Override
  public String gcmSenderId() {
    return getString(R.string.gcm_defaultSenderId);
  }

  public static OkHttpClient.Builder okHttpClientBuilder(OkHttpClient.Builder builder) {
    // Customize/override OkHttp client here
    return builder;
  }

  public List getExpoPackages() {
    return new BasePackageList().getPackageList();
  }
}
