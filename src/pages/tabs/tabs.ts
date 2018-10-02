import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController } from 'ionic-angular';
import { Track } from "../../models/track";

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-tabs',
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = 'HomePage';
    tab2Root = 'PlaylistsPage';
    tab3Root = 'BrowsePage';
    tab4Root = 'SearchPage';
    tab5Root = 'QueuePage';

    constructor(public navCtrl: NavController, public events: Events) {
        //
    }

}
