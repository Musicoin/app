import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Track } from "../../models/track";
import { ApiProvider } from "../../providers/api/api";
import "rxjs/add/operator/take";

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

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider) {

        api.getTopTracks().subscribe((tracks) => {
            this.topTracks = tracks.slice(0, 3);
            this.topTracksLoading = false;
        }, (error) => {
            console.log(error);
        });

        let testTrack1 = new Track();
        testTrack1.author = "IX";
        testTrack1.title = "Now Spell IX (Radio Edit)";
        testTrack1.link = "https://musicoin.org/nav/track/0x51539f99372a01c4e7ee5a34e884a8f7147cc008";
        testTrack1.address = "0x51539f99372a01c4e7ee5a34e884a8f7147cc008";
        testTrack1.imageSrc = "https://a.musicoin.org/media/cf391eb896dfd34559994f82dd0e1de38f65df0872176ecc4e24aacea1bb1a9163737103a59f2d2f394a7c35a567";
        testTrack1.artistAddress = "0xee6f52c18c6cf1b06ebdd31d8a2e987d26b62916";
        testTrack1.directPlayCount = Math.floor(Math.random() * 1000);
        testTrack1.directTipCount = Math.floor(Math.random() * 1000);
        this.testTracks.push(testTrack1);

        let testTrack2 = new Track();
        testTrack2.author = "isaac";
        testTrack2.title = "Chasing for ICO";
        testTrack2.link = "https://musicoin.org/nav/track/0x8c6cf658952d77c04de98c8a94c7b3b78d785b9f";
        testTrack2.address = "0x8c6cf658952d77c04de98c8a94c7b3b78d785b9f";
        testTrack2.imageSrc = "https://a.musicoin.org/media/cf3928baa1f0e946748c0e84e51b3cc48c41fc092a3043987512f0c49e9f32b47f16535eb9a33f6c2a5e0921a948";
        testTrack2.artistAddress = "0xb1a1ca710934e70e56848328a1ee75e0754c2664";
        testTrack2.directPlayCount = Math.floor(Math.random() * 1000);
        testTrack2.directTipCount = Math.floor(Math.random() * 1000);
        this.testTracks.push(testTrack2);

        let testTrack3 = new Track();
        testTrack3.author = "Ezra Vancil";
        testTrack3.title = "Don't Push Me Away";
        testTrack3.link = "https://musicoin.org/nav/track/0x7f8b75484bbd857c72dab1574181051cea091923";
        testTrack3.address = "0x7f8b75484bbd857c72dab1574181051cea091923";
        testTrack3.imageSrc = "https://a.musicoin.org/media/cf39229ba5c0a97640801a8ea35512a5ef68d90d3f1b05f27e04fc84b7b73f8344645556b39a1e500c6b21309e78";
        testTrack3.artistAddress = "0xb7a5afa28236a02add4724ec1e70f9416a65cb47";
        testTrack3.directPlayCount = Math.floor(Math.random() * 1000);
        testTrack3.directTipCount = Math.floor(Math.random() * 1000);
        this.testTracks.push(testTrack3);

        let testTrack4 = new Track();
        testTrack4.author = "Jumpsuit Records";
        testTrack4.title = "The Polish Ambassador - Rocket Heart ft. Katie Gray";
        testTrack4.link = "https://musicoin.org/nav/track/0x7e99067079db731662963453bd3e9c73f5edd914";
        testTrack4.address = "0x7e99067079db731662963453bd3e9c73f5edd914";
        testTrack4.imageSrc = "https://a.musicoin.org/media/cf3923b9a0adca5477ec3a97a8101bc5ca75da79072e58cc262daad5d1b102eb6652360692991b782e623817aa68";
        testTrack4.artistAddress = "0x707749cbd75f5f950c4f5b603632d551c3ee81f2";
        testTrack4.directPlayCount = Math.floor(Math.random() * 1000);
        testTrack4.directTipCount = Math.floor(Math.random() * 1000);
        this.testTracks.push(testTrack4);
    }

    onTrackClick(track) {
        this.navCtrl.push('TrackPage', { track: track });
    }

    goToSettings() {
        this.navCtrl.push('SettingsPage');
    }

    onTopTracksClick() {
        this.navCtrl.push('TopTracksPage');
    }
}
