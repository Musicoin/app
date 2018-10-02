import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";
import { Observable } from "rxjs/Observable";
import { StorageProvider } from "../../providers/storage/storage";

import cryptoRandomString from "crypto-random-string";

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-welcome',
    templateUrl: 'welcome.html',
})
export class WelcomePage {

    loading: boolean;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider,
                public storage: StorageProvider) {

        this.loading = true;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad WelcomePage');

        this.doLoginProcess();

        // this.checkEmailAndPassword();
        //
        // this.storage.getEmailAndPassword()
        //
        // // check login status
        // this.api.authToken().subscribe(
        //     (response) => {
        //         console.log(response);
        //         // if (response.status !== 200) {
        //         //     this.loading = false;
        //         // }
        //         // else {
        //         //     this.navCtrl.setRoot('TabsPage');
        //         // }
        //     },
        //     (error) => {
        //         console.log(error);
        //
        //         this.loading = false;
        //     }
        // );
    }

    navToLogIn() {
        this.navCtrl.push('LogInPage');
    }

    navToRegister() {
        this.navCtrl.push('RegisterPage');
    }

    private doLoginProcess() {
        this.checkEmailAndPassword();
    }

    private checkEmailAndPassword() {
        this.storage.getEmailAndPassword().subscribe((values) => {
            if (values.email && values.password) {
                console.log("Using existing account", values.email, values.password);

                this.clientSecret(values.email, values.password);
            }
            else {
                let username = 'mapp+' + cryptoRandomString(16);
                let email = username + '@musicoin.org';
                let password = cryptoRandomString(32);

                console.log("Creating new account", email, password);

                this.signup(email, password, username);
            }
        });
    }

    private signup(email: string, password: string, username: string) {
        this.api.signup(email, password, username).subscribe((response) => {
            if (response.success) {
                this.storage.setEmailAndPassword(email, password).subscribe(() => {
                    this.clientSecret(email, password);
                });
            }
            else {
                this.loading = false;
            }
        }, () => {
            this.loading = false;
        });
    }

    private clientSecret(email: string, password: string) {
        this.api.clientSecret(email, password).subscribe((response) => {
            if (response.success) {
                this.authToken(email, response.clientSecret)
            }
            else {
                this.loading = false;
            }
        }, () => {
            this.loading = false;
        });
    }

    private authToken(email: string, clientSecret: string) {
        this.api.authToken(email, clientSecret).subscribe((response) => {
            if (response.success) {
                this.api.setCredentials(email, response.accessToken);

                this.storage.setAuthToken(response.accessToken).subscribe(() => {
                    this.navCtrl.setRoot('TabsPage');
                });
            }
            else {
                this.loading = false;
            }
        }, () => {
            this.loading = false;
        });
    }

    /**
     *
     */
    anonymousLogin() {
        this.loading = true;

        this.storage.setEmailAndPassword('', '').subscribe(() => {
            this.doLoginProcess();
        });
    }
}
