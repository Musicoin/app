import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Track } from "../../models/track";
import { ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    private topTracksLoading: boolean = true;
    private topTracks: Track[] = [];

    private testTracks: Track[] = [];

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
        api.getTopTracks().subscribe((tracks) => {
            this.topTracksLoading = false;
            this.topTracks = tracks;
        }, (error) => {
            console.log(error);
        });

        let testTrack = new Track();
        testTrack.author = "IX";
        testTrack.title = "Now Spell IX (Radio Edit)";
        testTrack.ppp = "0x51539f99372a01c4e7ee5a34e884a8f7147cc008";
        testTrack.link = "https://musicion.org/nav/track/0x7e99067079db731662963453bd3e9c73f5edd914";
        testTrack.address = "0x7e99067079db731662963453bd3e9c73f5edd914";
        testTrack.imageSrc = "http://51.38.49.153:8080/media/cf391eb896dfd34559994f82dd0e1de38f65df0872176ecc4e24aacea1bb1a9163737103a59f2d2f394a7c35a567";
        testTrack.artistAddress = "0xee6f52c18c6cf1b06ebdd31d8a2e987d26b62916";
        this.testTracks.push(testTrack);
    }

    onTrackClick(track) {
        // this.navCtrl.push('TrackPage', { address: track.address });
        this.navCtrl.push('TrackPage', { track: track });
    }

    goToSettings() {
        this.navCtrl.push('SettingsPage');
    }

}
