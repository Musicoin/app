import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { ENV } from "@app/env";
import { ApiProvider } from "../../providers/api/api";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DebugPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-debug',
    templateUrl: 'debug.html',
})
export class DebugPage {
    private apiUrl: string = '-';
    private pppUrl: string = '-';
    private build: string = '-';
    private host: string = '-';
    private protocol: string = '-';
    private cordova: string = 'false';
    private email: string = '';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private appVersion: AppVersion,
                private platform: Platform,
                private api: ApiProvider,
                public storage: Storage
    ) {
        this.apiUrl = ENV.API_URL;
        this.pppUrl = ENV.PPP_URL;
        this.host = window.location.host;
        this.protocol = window.location.protocol;

        if (this.platform.is('cordova')) {
            this.cordova = 'true';

            this.appVersion.getVersionCode().then(value => {
                this.build = value.toString();
            })
        }

        this.storage.get('user.email').then(email => {
            this.email = email;
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DebugPage');
    }

    // corsTest() {
    //     this.api.test().subscribe(value => {
    //         alert('test OK');
    //     }, error => {
    //         alert('test error');
    //     });
    // }
}
