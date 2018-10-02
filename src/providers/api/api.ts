import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Track } from "../../models/track";
import { ENV } from "@app/env";
import { HTTP } from "@ionic-native/http";
import { from } from "rxjs/observable/from";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import "rxjs/add/operator/mergeMap";

@Injectable()
export class ApiProvider {

    apiUri: string;
    pppUri: string;

    credentials: {
        email: string;
        accessToken: string;
    };

    constructor(private ngHttp: HttpClient,
                private nativeHttp: HTTP,
                private platform: Platform,
                private storage: Storage
    ) {
        this.apiUri = ENV.API_URL;
        this.pppUri = ENV.PPP_URL;

        this.credentials = {
            email: '',
            accessToken: ''
        };
    }

    /**
     *
     * @param {string} uri
     * @returns {Observable<Object>|Observable<Array<Object>>}
     */
    // private get(uri: string) {
    //     let url = this.apiUri + uri;
    //
    //     if (this.platform.is('cordova')) {
    //         return from(this.nativeHttp.get(url, {}, this.headers())).map(response => {
    //             return JSON.parse(response.data);
    //         });
    //     }
    //
    //     return this.ngHttp.get(url, {
    //         headers: this.headers(),
    //         responseType: 'json',
    //         withCredentials: false
    //     });
    // }

    /**
     *
     */
    // artistProfile() {
    //     this.get('artist/profile/0xa50e63ff1ef89a5411cf6db32d27f0ff19ef68ae').subscribe(
    //         data => {
    //             console.log(data);
    //         }
    //     );
    // }

    /**
     *
     */
    // licenceDetail() {
    //     this.get('licence/detail/0x2738bf8e8c350acd35b7a7b7313b9b0faceddc2a').subscribe(
    //         data => {
    //             console.log(data);
    //         }
    //     );
    // }

    /**
     *
     * @param {string} trackId
     * @returns {Observable<Track>}
     */
    getTrack(trackAddress: string) {
        return this.getWithCredentials('release/details/' + trackAddress).map(track => {
            return new Track().deserialize(track);
        });
    }

    /**
     *
     * @param {string} uri
     * @param query
     * @returns {Observable<Object>}
     */
    getWithCredentials(uri: string, query = {}) {
        let params = this.credentialsHttpParams(this.getCredentials());

        Object.keys(query).forEach((key) => {
            console.log(key, query[key]);
            params = params.append(key, query[key]);
        });

        let headers = this.urlEncodedHttpHeaders();

        return this.ngHttp.get(
            this.apiUri + uri,
            {
                headers: headers,
                params: params
            }
        );
    }

    /**
     *
     * @param {string} uri
     * @returns {Observable<Object>}
     */
    postWithCredentials(uri: string, query = {}) {
        let params = new HttpParams({ encoder: new NativeEncoder() });

        Object.keys(query).forEach((key) => {
            console.log(key, query[key]);
            params = params.append(key, query[key]);
        });

        let headers = this.urlEncodedHttpHeaders();

        return this.ngHttp.post(
            this.apiUri + uri,
            params.toString(),
            {
                headers: headers,
                params: this.credentialsHttpParams(this.getCredentials())
            }
        );
    }

    getGenres() {
        return this.getWithCredentials('release/genres');
    }

    /**
     *
     * @returns {Observable<Array<Object>>}
     */
    getTopTracks() {
        return this.getWithCredentials('release/top').map((response: any) => {
            return response.data.map(track => new Track().deserialize(track));
        });
    }

    /**
     *
     * @param genre
     */
    getTopTracksByGenre(genre: string) {
        return this.getWithCredentials('release/topbygenre', { 'genre': genre }).map((response: any) => {
            return response.data.map(track => new Track().deserialize(track));
        });
    }

    /**
     *
     * @param artistName
     */
    getTopTracksForArtist(artistName: string) {
        return this.postWithCredentials('getsongsbya', { 'artistName': artistName }).map((response: any) => {
            console.log(response);
            return [];
        })
    }

    /**
     *
     * @param query
     * @returns {Observable<Track[]>}
     */
    searchTracks(query) {
        return this.postWithCredentials('search', { 'artistName': query }).catch(() => {
            return [];
        }).map((response: any) => {
            if (response.success) {
                return response.data.releases.map(track => new Track().deserialize(track));
            }
            return [];
        })
    }

    /**
     *
     * @param pppHash
     * @returns {Observable<HttpResponse<Blob>>}
     */
    downloadTrack(trackAddress: string) {
        let url = this.pppUri + 'track/' + trackAddress;
        console.log('downloadTrack', url);
        return this.ngHttp.get(url);
    }

    /**
     *
     * @param trackAddress
     * @returns {string}
     */
    getTrackPlaylistFileUrl(trackAddress: string) {
        return this.pppUri + 'tracks/' + trackAddress + '/index.m3u8';
    }

    /**
     *
     * @param {string} email
     * @param {string} clientSecret
     * @returns {Observable<authTokenResponse>}
     */
    authToken(email: string, clientSecret: string) {
        let params = new HttpParams({ encoder: new NativeEncoder() })
            .set('email', email)
            .set('clientSecret', clientSecret);

        let headers = this.urlEncodedHttpHeaders();

        return this.ngHttp.post<authTokenResponse>(
            this.apiUri + 'authtoken',
            params.toString(),
            {
                headers: headers
            }
        );
    }

    /**
     *
     * @param {string} address
     * @returns {Observable<Object>}
     */
    getArtistProfile(address: string) {
        return this.getWithCredentials('artist/profile/' + address);
    }

    /**
     *
     * @param email
     * @param password
     * @param username
     * @returns {Observable<signupResponse>}
     */
    signup(email, password, username) {
        let params = new HttpParams({ encoder: new NativeEncoder() })
            .set('email', email)
            .set('password', password)
            .set('username', username);

        let headers = this.urlEncodedHttpHeaders();

        return this.ngHttp.post<signupResponse>(
            this.apiUri + 'signup',
            params.toString(),
            {
                'headers': headers
            }
        );
    }

    /**
     *
     * @returns {Observable<Object>}
     */
    // userStats() {
    //     return this.getWithCredentials('user/stats');
    // }

    /**
     *
     * @param credentials
     */
    private credentialsHttpParams(credentials) {
        return new HttpParams({ encoder: new NativeEncoder() })
            .set('email', credentials.email)
            .set('accessToken', credentials.accessToken);
    }

    /**
     *
     * @returns {HttpHeaders}
     */
    private urlEncodedHttpHeaders() {
        return new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Cache-Control', 'no-cache');
    }

    /**
     *
     * @param {string} email
     * @param accessToken
     */
    setCredentials(email: string, accessToken: string) {
        this.credentials = {
            email: email,
            accessToken: accessToken
        };
    }

    /**
     *
     * @returns {{email: string; accessToken: string}}
     */
    getCredentials() {
        return this.credentials;
    }

    /**
     *
     * @param {string} email
     * @param password
     * @returns {Observable<clientSecretResponse>}
     */
    clientSecret(email: string, password: any) {
        let params = new HttpParams({ encoder: new NativeEncoder() })
            .set('email', email)
            .set('password', password);

        let headers = this.urlEncodedHttpHeaders();

        return this.ngHttp.post<clientSecretResponse>(
            this.apiUri + 'clientsecret',
            params.toString(),
            {
                'headers': headers
            }
        );
    }
}

// Angular parameter encoding has a bug on + characters, so use native browser encoding instead
class NativeEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
        return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
        return decodeURIComponent(value);
    }
}

class clientSecretResponse {
    public success: boolean;
    public clientSecret: string;
    public error;
}

class signupResponse {
    public success: boolean;
    public error;
}

class authTokenResponse {
    public success: boolean;
    public accessToken: string;
}
