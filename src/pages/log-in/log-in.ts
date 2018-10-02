import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LogInPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-log-in',
    templateUrl: 'log-in.html',
})
export class LogInPage {

    private email: string;
    private username: string;
    private password: string;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider,
                public storage: Storage) {
        //
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LogInPage');
    }

    logIn() {
        // this.api.logIn(this.email, this.username, this.password).subscribe((response) => {
        //     if (response.success === true) {
        //         this.storage.set('user.email', this.email);
        //         this.api.setCredentials(response.apiuser.clientId, response.apiuser.clientSecret).subscribe(() => {
        //             this.navCtrl.setRoot('TabsPage');
        //         });
        //     }
        // });
    }

}
