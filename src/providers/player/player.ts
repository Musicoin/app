import { Injectable } from '@angular/core';
import { AlertController, Events, Platform } from "ionic-angular";
import { HttpEventType } from "@angular/common/http";
import { ApiProvider } from "../api/api";
import "rxjs/add/observable/fromPromise";
import { Track } from "../../models/track";
import { Subscription } from "rxjs/Subscription";
import { MusicControls } from "@ionic-native/music-controls";

import Hls from 'hls.js';

@Injectable()
export class PlayerProvider {
    // private audio: HTMLAudioElement;
    private track: Track;
    private getTrackSubscription: Subscription;
    private downloadSubscription: Subscription;

    private video;

    private queue: Track[] = [];

    constructor(public events: Events,
                private api: ApiProvider,
                private alertCtrl: AlertController,
                private musicControls: MusicControls,
                private platform: Platform
    ) {

        this.events.subscribe('play', (track: Track) => {
            this.play(track);
        });

        this.events.subscribe('transport.play', () => {
            if (this.video) {
                this.video.play();
            }
        });
        this.events.subscribe('transport.pause', () => {
            if (this.video) {
                this.video.pause();
            }
        });

        this.video = document.getElementById('video');

        this.video.onplay = () => {
            console.log('this.audio.onplay');
            this.events.publish('track.play');

            if (this.platform.is('cordova')) {
                console.log('creating music controls...');
                this.musicControls.create({
                    track: this.track.title,        // optional, default : ''
                    artist: this.track.author,                       // optional, default : ''
                    //cover: this.track.imageSrc,      // optional, default : nothing
                    //isPlaying: true,
                    //hasPrev: false,      // show previous button, optional, default: true
                    //hasNext: false,      // show next button, optional, default: true
                }).then(() => {
                    console.log('musicControls.success');
                }).catch(() => {
                    console.log('musicControls.error');
                });
                this.musicControls.listen(); // activates the observable above
                this.musicControls.updateIsPlaying(true);
            }
        };

        this.video.onplaying = () => {
            console.log('this.audio.onplaying');
            this.events.publish('track.play');
        };

        this.video.onpause = () => {
            this.events.publish('track.pause');
        };

        this.video.onended = () => {
            this.events.publish('track.ended');
        };

        this.video.ontimeupdate = () => {
            this.playProgress();
        };

        this.video.onerror = () => {
            console.log(this.video.error);
        };

        this.video.onprogress = (e) => {
            console.log(e);
            this.loadProgress(this.video.buffered.end(0), this.video.duration);
            // this.events.publish('track.loaded')
        }
    }

    public enqueue(track: Track) {
        this.queue.push(track);
    }

    public play(track: Track) {
        // this.audio.pause();
        // this.track = null;
        // this.playProgress();
        this.loadProgress(0, 0);
        if (this.getTrackSubscription) {
            this.getTrackSubscription.unsubscribe();
        }
        if (this.downloadSubscription) {
            this.downloadSubscription.unsubscribe();
        }


        // this.getTrackSubscription = this.api.getTrack(trackAddress).subscribe(track => {
        console.log('PlayerProvider.play', track);

        this.queue.push(track);
        this.track = track;

        this.events.publish('track.load', track);

        // trigger encode on track if not already ready for streaming
        this.api.downloadTrack(track.address).subscribe((response) => {
            console.log(response);
        });

        if (Hls.isSupported()) {
            console.log('Hls.isSupported === true');
            let hls = new Hls();
            hls.loadSource(this.api.getTrackPlaylistFileUrl(track.address));
            hls.attachMedia(this.video);
            this.video.load();
            this.video.play();
            // hls.on(Hls.Events.MANIFEST_PARSED, () => {
            //     this.video.play();
            // });
        }
        else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = this.api.getTrackPlaylistFileUrl(track.address);
            this.video.load();
            this.video.play();
            // this.video.addEventListener('canplay', () => {
            //     this.video.play();
            // });
        }
        else {
            console.log("not supported");
        }

        // this.downloadSubscription = this.api.downloadTrack(track.ppp).subscribe(event => {
        //     console.log(event);
        //
        //     // if (event.status == 200) {
        //     //     this.events.publish('track.load.completed');
        //     //     this.playFromBlob(event.data, track.contentType);
        //     // }
        //
        //     switch (event.type) {
        //         case HttpEventType.ResponseHeader:
        //             console.log('HttpEventType.ResponseHeader', event);
        //             if (event.status === 200) {
        //
        //                 // this.track = track;
        //                 //
        //                 this.events.publish('track.load', track);
        //             }
        //             break;
        //
        //         case HttpEventType.DownloadProgress:
        //             console.log('HttpEventType.DownloadProgress', event);
        //             this.loadProgress(event.loaded, event.total);
        //             break;
        //
        //         case HttpEventType.Response:
        //             console.log('HttpEventType.Response', event);
        //             console.log(event.headers);
        //             this.events.publish('track.load.completed');
        //             this.playFromBlob(event.body, track.contentType);
        //             break;
        //
        //         default:
        //             console.log('Default', event);
        //             break;
        //     }
        // }, (error) => {
        //     console.log('Error', error);
        //     let alert = this.alertCtrl.create({
        //         title: 'Cannot play track',
        //         subTitle: 'Try again in 30 seconds',
        //         buttons: ['OK']
        //     });
        //     alert.present();
        //
        //     this.queue.pop();
        // });
        // }, (error) => {
        //     console.log('Error', error);
        //     let alert = this.alertCtrl.create({
        //         title: 'Error',
        //         subTitle: error,
        //         buttons: ['OK']
        //     });
        //     alert.present();
        // });
    }

    // private playFromM3u8

    private playFromBlob(blobData, contentType) {
        console.log('blobData', blobData);

        // try {
        //     // let blobObject = new Blob([blobData]);
        //     // let blobUrl = URL.createObjectURL(blobObject);
        //
        //
        //     let blobUrl = URL.createObjectURL(blobData);
        //
        //     this.audio.src = blobUrl;
        //     this.audio.load();
        //     this.audio.play().then(value => {
        //         console.log('audio.play() success', value)
        //     }, reason => {
        //         console.log('audio.play() rejected', reason)
        //     }).catch(reason => {
        //         console.log('audio.play() catch', reason);
        //     });
        // }
        // catch (e) {
        //     console.log(e);
        // }
    }

    private playProgress() {
        let percentage = '0.00';
        if (this.video && this.video.currentTime && this.video.duration) {
            percentage = ((this.video.currentTime / this.video.duration) * 100).toFixed(2);
        }
        this.events.publish('track.progress', {
            percentage: percentage,
            currentTime: this.video.currentTime,
            duration: this.video.duration
        });
    }

    private loadProgress(loaded: number, total: number) {
        let progress = '0.00';
        if (this.video && total) {
            progress = ((loaded / total) * 100).toFixed(2);
        }
        this.events.publish('track.load.progress', progress);
    }
}
