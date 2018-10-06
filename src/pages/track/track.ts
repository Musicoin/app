import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { ApiProvider } from "../../providers/api/api";
import { Track } from "../../models/track";

/**
 * Generated class for the TrackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-track',
    templateUrl: 'track.html',
})
export class TrackPage {
    public loading: boolean;
    public trackAddress: string;
    public track: Track;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public apiProvider: ApiProvider,
                public events: Events) {

        this.loading = true;

        this.track = navParams.get('track') || false;

        if (!this.track) {
            this.trackAddress = navParams.get('address');

            this.apiProvider.getTrack(this.trackAddress).subscribe((track: Track) => {
                this.track = track;
                this.loading = false;
            }, error => {
                this.navCtrl.pop();
            });
        }
        else {
            this.loading = false;
        }
    }

    playTrack() {
        this.events.publish('queue.track', this.track);
    }

    navToArtist(artistAddress: string) {
        this.navCtrl.push('ArtistPage', { address: artistAddress });
    }
}
