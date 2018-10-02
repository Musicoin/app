import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Genre } from "../../models/genre";
import { ApiProvider } from "../../providers/api/api";

/**
 * Generated class for the BrowsePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-browse',
    templateUrl: 'browse.html',
})
export class BrowsePage {

    public genres: Array<string> = [];
    public loading: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
        this.loading = true;

        this.api.getGenres().subscribe((genres: Array<string>) => {
            this.genres = genres;

            this.loading = false;
        });
    }

    onGenreClick(genre: string) {
        this.navCtrl.push('GenrePage', { genre: genre });
    }
}
