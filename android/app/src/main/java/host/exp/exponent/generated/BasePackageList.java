package host.exp.exponent.generated;

import java.util.Arrays;
import java.util.List;
import org.unimodules.core.interfaces.Package;

public class BasePackageList {
  public List<Package> getPackageList() {
    return Arrays.<Package>asList(
        new expo.modules.ads.facebook.AdsFacebookPackage(),
        new expo.modules.appauth.AppAuthPackage(),
        new expo.modules.backgroundfetch.BackgroundFetchPackage(),
        new expo.modules.brightness.BrightnessPackage(),
        new expo.modules.constants.ConstantsPackage(),
        new expo.modules.crypto.CryptoPackage(),
        new expo.modules.facebook.FacebookPackage(),
        new expo.modules.filesystem.FileSystemPackage(),
        new expo.modules.font.FontLoaderPackage(),
        new expo.modules.gl.GLPackage(),
        new expo.modules.google.signin.GoogleSignInPackage(),
        new expo.modules.haptics.HapticsPackage(),
        new expo.modules.imagemanipulator.ImageManipulatorPackage(),
        new expo.modules.intentlauncher.IntentLauncherPackage(),
        new expo.modules.keepawake.KeepAwakePackage(),
        new expo.modules.lineargradient.LinearGradientPackage(),
        new expo.modules.localauthentication.LocalAuthenticationPackage(),
        new expo.modules.localization.LocalizationPackage(),
        new expo.modules.permissions.PermissionsPackage(),
        new expo.modules.random.RandomPackage(),
        new expo.modules.securestore.SecureStorePackage(),
        new expo.modules.sensors.SensorsPackage(),
        new expo.modules.sharing.SharingPackage(),
        new expo.modules.speech.SpeechPackage(),
        new expo.modules.sqlite.SQLitePackage(),
        new expo.modules.taskManager.TaskManagerPackage(),
        new expo.modules.webbrowser.WebBrowserPackage()
    );
  }
}
