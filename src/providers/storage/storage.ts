import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from "rxjs/Observable";

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {

    constructor(public http: HttpClient, private storage: Storage) {
        //
    }

    setEmailAndPassword(email: string, password: string) {
        return Observable.fromPromise(Promise.all([
            this.storage.set('user.email', email),
            this.storage.set('user.password', password)
        ]));
    }

    setClientSecret(clientSecret: string) {
        return Observable.fromPromise(this.storage.set('user.clientSecret', clientSecret));
    }

    setAuthToken(authToken: string) {
        return Observable.fromPromise(this.storage.set('user.authToken', authToken));
    }

    getEmailAndPassword() {
        return Observable.fromPromise(Promise.all([
            this.storage.get('user.email'),
            this.storage.get('user.password')]
        ).then((values) => {
            return {
                email: values[0],
                password: values[1]
            }
        }));
    }

    getClientSecret() {
        return Observable.fromPromise(this.storage.get('user.clientSecret'));
    }

    getAuthToken() {
        return Observable.fromPromise(this.storage.get('user.authToken'));
    }
    
}
