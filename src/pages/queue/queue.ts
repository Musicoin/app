import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { PlayerProvider } from "../../providers/player/player";
import { Track } from "../../models/track";

/**
 * Generated class for the QueuePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-queue',
    templateUrl: 'queue.html',
})
export class QueuePage {
    public queue: Track[] = [];
    public queueIndex: number;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public player: PlayerProvider,
                public events: Events
    ) {
        this.events.subscribe('queue.update', (data) => {
            console.log(data);
            this.queue = data.queue;
            this.queueIndex = data.queueIndex;
        });
        this.events.publish('queue.publish');
    }

    remove(index: number) {
        console.log('remove', index);
        this.events.publish('queue.remove', index);
    }

    onTrackTap(index: number) {
        this.events.publish('queue.play', index);
    }
}
