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
    loader: any;
    public trackAddress: string;
    public track: Track;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public apiProvider: ApiProvider,
                public loadingCtrl: LoadingController,
                public events: Events) {

        this.track = navParams.get('track');

        console.log(this.track);

        if (!this.track) {
            this.loader = this.loadingCtrl.create({
                content: "Loading...",
                // duration: 3000
            });
            this.loader.present();

            this.trackAddress = navParams.get('address');

            this.apiProvider.getTrack(this.trackAddress).subscribe(track => {
                this.track = new Track().deserialize(track);
                this.loader.dismiss();
                console.log(track);
            }, error => {
                this.loader.dismiss();
            });
        }
        else {
            console.log(this.track);
        }
    }

    playTrack() {
        this.events.publish('play', this.track);
    }

    navToArtist(artistAddress: string) {
        this.navCtrl.push('ArtistPage', { address: artistAddress });
    }
}
