import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";
import { Track } from "../../models/track";
import { Artist } from "../../models/artist";
import "rxjs/add/operator/delay";

/**
 * Generated class for the ArtistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-artist',
    templateUrl: 'artist.html',
})
export class ArtistPage {

    public loading: boolean;

    public artist;

    public topTracks: Track[];
    public topTracksLoading: boolean;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider) {

        this.loading = true;

        this.topTracks = [];
        this.topTracksLoading = true;

        let artistAddress = this.navParams.get('address');

        this.api.getArtistProfile(artistAddress).subscribe((artist: Artist) => {
            this.artist = artist;
            this.loading = false;

            console.log(artist);

            setTimeout(() => {
                this.api.getTopTracksForArtist(artist.artistName).subscribe((tracks) => {
                    this.topTracks = tracks;
                    this.topTracksLoading = false;
                });
            }, 2000);

        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ArtistPage');
    }

}
