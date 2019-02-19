package com.alko.alko;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.instabug.reactlibrary.RNInstabugReactnativePackage;
import com.ivanwu.googleapiavailabilitybridge.ReactNativeGooglePlayServicesPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import io.invertase.firebase.RNFirebasePackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new VectorIconsPackage(),
            new ReactNativePushNotificationPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new PickerPackage(),
            new RNI18nPackage(),
            new ReactNativeGooglePlayServicesPackage(),
            new GoogleAnalyticsBridgePackage(),
            new RNFirebasePackage(),
            new RNFetchBlobPackage(),
            new FIRMessagingPackage(),
            new RNBackgroundGeolocation(),
      		  new RNInstabugReactnativePackage.Builder("26449c8d4f233bf034af16658e6f7a96",MainApplication.this)
							.setInvocationEvent("shake")
							.setPrimaryColor("#1D82DC")
							.setFloatingEdge("left")
							.setFloatingButtonOffsetFromTop(250)
							.build(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
