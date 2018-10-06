import { Component, ViewChild } from '@angular/core';

import { Events, Keyboard } from "ionic-angular";
import { ModalController, NavParams } from 'ionic-angular';
import { Track } from "../../models/track";
import { PlayerProvider } from "../../providers/player/player";
import { PlayerModalPage } from "../../pages/player-modal/player-modal";

@Component({
    selector: 'mini-player',
    templateUrl: 'mini-player.html'

})
export class MiniPlayerComponent {
    track: Track = null;

    isPlaying: boolean = false;
    isPaused: boolean = false;
    isLoading: boolean = false;

    loadProgress: any = 0;
    playProgress: any = 0;

    currentTime: number = 0;
    duration: number = 0;

    hideMiniPlayer: boolean = true;

    constructor(public events: Events,
                public player: PlayerProvider,
                public modalCtrl: ModalController,
                public keyboard: Keyboard
    ) {
        keyboard.willShow.subscribe(() => {
            this.events.publish('miniplayer.hide');
        });
        keyboard.willHide.subscribe(() => {
            setTimeout(() => {
                if (this.track) {
                    this.events.publish('miniplayer.show');
                }
            }, 50);
        });

        this.events.subscribe('miniplayer.show', () => {
            // console.log('MiniPlayerComponent miniplayer.show');
            this.hideMiniPlayer = false;
        });
        this.events.subscribe('miniplayer.hide', () => {
            // console.log('MiniPlayerComponent miniplayer.hide');
            this.hideMiniPlayer = true;
        });

        this.events.subscribe('track.load', (track) => {
            // this.isLoading = true;
            this.playProgress = 0;
            this.loadProgress = 0;
            this.track = track;
            this.events.publish('miniplayer.show');
        });
        this.events.subscribe('track.load.progress', (percentage) => {
            // this.isLoading = true;
            this.loadProgress = percentage;
        });
        this.events.subscribe('track.load.completed', (track) => {
            // this.isLoading = false;
        });

        this.events.subscribe('track.ready', (track) => {
            console.log('MiniPlayer track.ready');
            this.isPlaying = true;
            this.isPaused = false;
        });
        this.events.subscribe('track.play', (track) => {
            // this.track = track;
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
    }

    playClicked($event) {
        $event.stopPropagation();
        this.events.publish('transport.play');
    }

    pauseClicked($event) {
        $event.stopPropagation();
        this.events.publish('transport.pause');
    }

    miniPlayerClicked() {
        let playerModal = this.modalCtrl.create('PlayerModalPage', {
            track: this.track,
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            isLoading: this.isLoading,
            loadProgress: this.loadProgress,
            playProgress: this.playProgress,
            currentTime: this.currentTime,
            duration: this.duration
        });
        playerModal.present();
    }
}
