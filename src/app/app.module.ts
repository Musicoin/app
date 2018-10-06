import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { ApiProvider } from '../providers/api/api';
// import { HttpBackend, HttpXhrBackend } from "@angular/common/http";
import { ComponentsModule } from "../components/components.module";
import { PlayerProvider } from '../providers/player/player';
import { AppVersion } from "@ionic-native/app-version";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { HTTP } from '@ionic-native/http';
import { MusicControls } from "@ionic-native/music-controls";
import { IonicStorageModule } from "@ionic/storage";
import { StorageProvider } from '../providers/storage/storage';
import { StreamingMedia } from "@ionic-native/streaming-media";
import { Media } from "@ionic-native/media";

// import { NativeHttpBackend, NativeHttpFallback, NativeHttpModule } from "ionic-native-http-connection-backend";

@NgModule({
    declarations: [
        MyApp
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(
            MyApp,
            {
                backButtonText: '',
                backButtonIcon: 'md-arrow-round-back',
                iconMode: 'md',
                modalEnter: 'modal-slide-in',
                modalLeave: 'modal-slide-out',
                tabsPlacement: 'bottom',
                pageTransition: 'ios-transition'
            }
        ),
        ComponentsModule,
        IonicStorageModule.forRoot()
    ],
    bootstrap: [
        IonicApp
    ],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        },
        ApiProvider,
        PlayerProvider,
        AppVersion,
        HTTP,
        MusicControls,
        StorageProvider,
        StreamingMedia,
        Media
    ]
})
export class AppModule {
}
