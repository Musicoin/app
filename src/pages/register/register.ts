import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {

    private email;
    private username;
    private password;
    private errors = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad RegisterPage');
    }

    register() {
        this.errors = [];

        // this.api.register(this.email, this.username, this.password).subscribe(response => {
        //     if (response.success === true) {
        //         // ok
        //     }
        //     else {
        //         this.errors = response.error;
        //     }
        // });
    }

}
