import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Track } from "../../models/track";
import { ApiProvider } from "../../providers/api/api";
import { Subscription } from "rxjs/Subscription";
import { query } from "@angular/core/src/animation/dsl";
import { Artist } from "../../models/artist";

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
})
export class SearchPage {
    query: string;
    queryInput: string;
    searchTracks: Array<Track> = [];
    searchArtists: Array<Artist> = [];
    searching: boolean = false;
    private searchingSubscription: Subscription;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
        //
    }

    onInput($event) {
        this.query = this.queryInput.trim();
        this.searchTracks = [];

        this.cancelSearchRequest();

        if (this.query.length == 0) {
            return;
        }

        this.searching = true;
        this.searchingSubscription = this.api.searchTracks(this.query).subscribe((tracks) => {
            this.searchTracks = tracks.splice(0, 3);
            this.searching = false;
        });
    }

    onCancel($event) {
        this.cancelSearchRequest();
    }

    cancelSearchRequest() {
        this.searching = false;
        this.searchTracks = [];
        if (this.searchingSubscription) {
            this.searchingSubscription.unsubscribe();
        }
    }

    onTrackClick(track) {
        this.navCtrl.push('TrackPage', { address: track.address })
    }
}
