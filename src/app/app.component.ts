import { Component, ViewChild } from '@angular/core';
import { Events, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = 'WelcomePage';
    hasMiniPlayer: boolean = false;

    constructor(private platform: Platform,
                private statusBar: StatusBar,
                private splashScreen: SplashScreen,
                private events: Events) {

        platform.ready().then(() => {
            if (platform.is('cordova')) {
                statusBar.styleDefault();
                // statusBar.backgroundColorByHexString('#2f2d2b');

                setTimeout(() => {
                    splashScreen.hide();
                }, 500);
            }
        });

        events.subscribe('miniplayer.show', () => {
            this.hasMiniPlayer = true;
        });
        events.subscribe('miniplayer.hide', () => {
            this.hasMiniPlayer = false;
        });
    }
}

