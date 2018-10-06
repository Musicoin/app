import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Track } from "../../models/track";

@IonicPage()
@Component({
    selector: 'page-player-modal',
    templateUrl: 'player-modal.html',
})
export class PlayerModalPage {
    track: Track = null;

    isPlaying: boolean = false;
    isPaused: boolean = false;
    isLoading: boolean = true;

    isQueueVisible: boolean = false;

    loadProgress: any = 0;
    playProgress: any = 0;
    private currentTime: number = 0;
    private duration: number = 0;

    private canSkipForward: boolean;
    private canSkipBackward: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public events: Events) {
        this.track = navParams.get('track');
        this.isPlaying = navParams.get('isPlaying');
        this.isPaused = navParams.get('isPaused');
        this.isLoading = navParams.get('isLoading');
        this.loadProgress = navParams.get('loadProgress');
        this.playProgress = navParams.get('playProgress');
        this.currentTime = navParams.get('currentTime');
        this.duration = navParams.get('duration');

        this.events.subscribe('track.load', (track) => {
            this.isLoading = true;
            this.playProgress = 0;
            this.loadProgress = 0;
            this.track = track;
        });
        // this.events.subscribe('track.load.progress', (percentage) => {
        //     this.isLoading = true;
        //     this.loadProgress = percentage;
        // });
        // this.events.subscribe('track.load.completed', (track) => {
        //     this.isLoading = false;
        // });

        this.events.subscribe('track.ready', (track) => {
            console.log('MiniPlayer track.ready');
            this.isPaused = false;
            this.isPlaying = true;
        });
        this.events.subscribe('track.play', (track) => {
            this.isLoading = false;
            this.isPaused = false;
            this.isPlaying = true;
        });
        this.events.subscribe('track.pause', () => {
            this.isPlaying = false;
            this.isPaused = true;
        });
        this.events.subscribe('track.progress', (progress) => {
            this.playProgress = progress.percentage;
            this.currentTime = progress.currentTime;
            this.duration = progress.duration;
        });
        this.events.subscribe('track.stopped', () => {
            this.isPlaying = false;
            this.isPaused = true;
        });

        this.events.subscribe('queue.update', (data) => {
            this.canSkipForward = data.canSkipForward;
            this.canSkipBackward = data.canSkipBackward;
        });
        this.events.publish('queue.publish');

    }

    closeClick() {
        this.viewCtrl.dismiss();
    }

    playClicked($event) {
        $event.stopPropagation();
        this.events.publish('transport.play');
    }

    pauseClicked($event) {
        $event.stopPropagation();
        this.events.publish('transport.pause');
    }

    formattedMmSs(seconds) {
        let mm = Math.floor(seconds / 60).toFixed(0);
        let ss = Math.floor(seconds % 60).toFixed(0);
        return this.strPadLeft(mm, '0', 2) + ':' + this.strPadLeft(ss, '0', 2);
    }

    strPadLeft(string, pad, length) {
        return (new Array(length + 1).join(pad) + string).slice(-length);
    }

    showQueue() {
        this.isQueueVisible = true;
    }

    hideQueue() {
        this.isQueueVisible = false;
    }

    toggleQueue() {
        this.isQueueVisible = !this.isQueueVisible;
    }

    skipBackwardClicked($event) {
        $event.stopPropagation();
        this.events.publish('transport.skip-backward');
    }

    skipForwardClicked($event) {
        $event.stopPropagation();
        this.events.publish('transport.skip-forward');
    }
}
