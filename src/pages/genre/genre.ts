import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";
import { Track } from "../../models/track";

/**
 * Generated class for the GenrePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-genre',
    templateUrl: 'genre.html',
})
export class GenrePage {

    public genre: string;

    private topTracksLoading: boolean;
    private topTracks: Track[];

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
        this.genre = navParams.get('genre');

        this.topTracks = [];
        this.topTracksLoading = true;

        this.api.getTopTracksByGenre(this.genre).subscribe((tracks) => {
            this.topTracks = tracks;
            this.topTracksLoading = false;
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GenrePage');
    }

    onTrackClick(track) {
        this.navCtrl.push('TrackPage', { track: track });
    }

}
