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

    headers: {};

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

        this.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache'
        }
    }

    /**
     *
     * @param {string} trackId
     * @returns {Observable<Track>}
     */
    getTrack(trackAddress: string) {
        return this.getWithCredentials('release/details/' + trackAddress).map((response: any) => {
            return new Track().deserialize(response.data);
        });
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
            if (response.success) {
                return response.data.map(track => new Track().deserialize(track));
            }
            return [];
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
        return this.postWithCredentials('getsongsbya', null, { 'artistName': artistName }).map((response: any) => {
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
     */
    encodeTrack(trackAddress: string) {
        let url = this.pppUri + 'encode-track/' + trackAddress;
        return this.get(url);
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
     * @param trackAddress
     */
    getTrackPlaylistFileBlob(trackAddress: string) {
        this.get(this.getTrackPlaylistFileUrl(trackAddress)).map(response => {
            // console.log(response);
            let blob = new Blob([response], { type: 'application/vnd.apple.mpegurl' });
            let url = URL.createObjectURL(blob);
            // console.log('Blob URL', url);
            return url;
        });
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
     * @param url
     * @param params
     * @param headers
     */
    get(url: string, params: any = {}, headers: any = this.headers) {
        if (this.platform.is('cordova')) {
            console.log('nativeHttp.get', url, params, headers);
            return from(this.nativeHttp.get(url, params, headers)).map((response) => {

                let key = Object.keys(response.headers).find((header) => {
                    return header.match(/content-type/i) !== null;
                });
                if (key) {
                    if (response.headers[key].match(/application\/json/i) !== null) {
                        return JSON.parse(response.data);
                    }
                }
                return response.data;
            });
        }
        else {
            console.log('ngHttp.get', url, params, headers);
            return this.ngHttp.get(
                url,
                {
                    headers: this.urlEncodedHttpHeaders(headers),
                    params: this.urlEncodedHttpParams(params)
                }
            );
        }
    }

    /**
     *
     * @param url
     * @param params
     * @param body
     * @param headers
     */
    post(url: string, params: any = null, body: any = null, headers: any = this.headers) {
        if (params) {
            url = url + '?' + this.urlEncodedHttpParams(params);
        }
        if (this.platform.is('cordova')) {
            console.log('nativeHttp.post', url, body, headers);
            return from(this.nativeHttp.post(url, body, headers)).map((response) => {
                return JSON.parse(response.data);
            });
        }
        else {
            console.log('ngHttp.post', url, body, headers);
            return this.ngHttp.post(
                url,
                this.urlEncodedHttpParams(body),
                {
                    headers: this.urlEncodedHttpHeaders(headers),
                }
            );
        }
    }

    /**
     *
     * @param {string} uri
     * @param params
     * @returns {Observable<Object>}
     */
    getWithCredentials(uri: string, params = null) {
        let url = this.apiUri + uri;

        if (!params) {
            params = {};
        }
        params['email'] = this.credentials.email;
        params['accessToken'] = this.credentials.accessToken;

        return this.get(url, params);
    }

    /**
     *
     * @param {string} uri
     * @param params
     * @param body
     * @returns {Observable<Object>}
     */
    postWithCredentials(uri: string, params = null, body = null) {
        let url = this.apiUri + uri;

        if (!params) {
            params = {};
        }
        params['email'] = this.credentials.email;
        params['accessToken'] = this.credentials.accessToken;

        return this.post(url, params, body);
    }

    /**
     *
     * @param email
     * @param password
     * @param username
     * @returns {Observable<signupResponse>}
     */
    signup(email, password, username) {
        let url = this.apiUri + 'signup';

        let body = {
            'email': email,
            'password': password,
            'username': username
        };

        return this.post(url, null, body);
    }

    /**
     *
     * @param {string} email
     * @param password
     * @returns {Observable<clientSecretResponse>}
     */
    clientSecret(email: string, password: any) {
        let url = this.apiUri + 'clientsecret';

        let body = {
            'email': email,
            'password': password
        };

        return this.post(url, null, body);
    }

    /**
     *
     * @param {string} email
     * @param {string} clientSecret
     * @returns {Observable<authTokenResponse>}
     */
    authToken(email: string, clientSecret: string) {
        let url = this.apiUri + 'authtoken';

        let body = {
            'email': email,
            'clientSecret': clientSecret
        };

        return this.post(url, null, body);
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
     * @param params
     */
    private urlEncodedHttpParams(params: any) {
        let httpParams = new HttpParams({ encoder: new NativeEncoder() });

        Object.keys(params).forEach((key) => {
            console.log(key, params[key]);
            httpParams = httpParams.append(key, params[key]);
        });

        return httpParams;
    }

    /**
     *
     * @returns {HttpHeaders}
     */
    private urlEncodedHttpHeaders(headers: any) {
        let httpHeaders = new HttpHeaders();

        Object.keys(headers).forEach((key) => {
            console.log(key, headers[key]);
            httpHeaders = httpHeaders.append(key, headers[key]);
        });

        return httpHeaders;
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
