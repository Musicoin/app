import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";
import { Track } from "../../models/track";

/**
 * Generated class for the TopTracksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-top-tracks',
    templateUrl: 'top-tracks.html',
})
export class TopTracksPage {

    private tracksLoading: boolean = true;
    private tracks: Track[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {

        this.tracksLoading = true;
        this.api.getTopTracks().subscribe((tracks) => {
            this.tracks = tracks;
            this.tracksLoading = false;
        })
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad TopTracksPage');
    }

    onTrackClick(track) {
        this.navCtrl.push('TrackPage', { track: track });
    }
}
