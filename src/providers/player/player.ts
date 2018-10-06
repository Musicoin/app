import { Injectable } from '@angular/core';
import { AlertController, Events, Platform } from "ionic-angular";
import { ApiProvider } from "../api/api";
import "rxjs/add/observable/fromPromise";
import { Track } from "../../models/track";
import { MusicControls } from "@ionic-native/music-controls";
import { Media, MediaObject } from '@ionic-native/media';

@Injectable()
export class PlayerProvider {
    private track: Track = null;
    private player: MediaObject = null;
    private queue: Track[] = [];
    private queueIndex: number = 0;

    constructor(public events: Events,
                private api: ApiProvider,
                private alertCtrl: AlertController,
                private musicControls: MusicControls,
                private platform: Platform,
                private media: Media
    ) {
        this.events.subscribe('queue.track', (track: Track) => {
            this.enqueueTrack(track);
        });
        this.events.subscribe('queue.tracks', (tracks: Track[]) => {
            this.enqueueTracks(tracks);
        });
        this.events.subscribe('queue.remove', (index: number) => {
            this.removeQueueIndex(index);
        });
        this.events.subscribe('queue.play', (index: number) => {
            this.playQueueIndex(index);
        });
        this.events.subscribe('queue.publish', () => {
           this.publishQueueData();
        });

        this.events.subscribe('transport.play', () => {
            this.play();
        });
        this.events.subscribe('transport.pause', () => {
            this.pause();
        });
        this.events.subscribe('transport.skip-forward', () => {
            this.skipForward();
        });
        this.events.subscribe('transport.skip-backward', () => {
            this.skipBackward();
        });

        setInterval(() => {
            this.publishPlayProgress();
        }, 25);
    }

    /**
     *
     */
    private play() {
        if (this.player) {
            this.player.play();
        }
    }

    /**
     *
     */
    private pause() {
        if (this.player) {
            this.player.pause();
        }
    }

    /**
     *
     * @param track
     */
    private enqueueTrack(track: Track) {
        this.queue.push(track);

        if (this.queue.length > 0 && this.track === null) {
            this.queueIndex = 0;
            this.playQueueIndex(this.queueIndex);
        }

        this.publishQueueData();
    }

    /**
     *
     * @param tracks
     */
    private enqueueTracks(tracks: Track[]) {
        for (let track of tracks) {
            this.enqueueTrack(track);
        }
    }

    /**
     *
     */
    private skipBackward() {
        if (this.canSkipBackward()) {
            this.queueIndex -= 1;
            console.log('skipBackward', this.queueIndex);
            this.playQueueIndex(this.queueIndex);
        }
        else {
            console.log("Can't go previous");
        }
    }

    /**
     *
     */
    private canSkipBackward() {
        return (this.queueIndex > 0);
    }

    /**
     *
     */
    private skipForward() {
        if (this.canSkipForward()) {
            this.queueIndex += 1;
            console.log('skipForward', this.queueIndex);
            this.playQueueIndex(this.queueIndex);
        }
        else {
            console.log("Can't go next");
        }
    }

    /**
     *
     */
    private canSkipForward() {
        return (this.queueIndex < this.queue.length - 1);
    }

    /**
     *
     * @param index
     */
    private playQueueIndex(index: number) {
        console.log('player.playQueueIndex', index);

        let track: Track = this.queue[index];

        if (!track) return;

        this.queueIndex = index;

        this.publishQueueData();

        this.track = track;

        this.events.publish('track.load', this.track);

        // trigger encode on track if not already ready for streaming
        this.api.encodeTrack(track.address).subscribe((response) => {
            // console.log(response);
        }, (error) => {
            // console.log(error);
        });

        if (this.player) {
            this.player.stop();
            this.player.release();
            this.player = null;
        }

        this.player = this.media.create(this.api.getTrackPlaylistFileUrl(track.address));

        this.player.onError.subscribe(data => {
            console.log('player.onError', data);
            this.events.publish('track.error');
        });

        this.player.onStatusUpdate.subscribe(data => {
            console.log('player.onStatusUpdate', data);
            switch (data) {
                case this.media.MEDIA_NONE: // 0
                    break;

                case this.media.MEDIA_STARTING: // 1
                    break;

                case this.media.MEDIA_RUNNING: // 2
                    this.events.publish('track.play');
                    // this.events.publish('track.playing');
                    break;

                case this.media.MEDIA_PAUSED: // 3
                    this.events.publish('track.pause');
                    break;

                case this.media.MEDIA_STOPPED: // 4
                    console.log('this.media.MEDIA_STOPPED');
                    this.events.publish('track.stopped');
                    break;

                default:
                    //
                    break;
            }
        });

        this.player.onSuccess.subscribe(data => {
            console.log('player.onSuccess', data);
            this.events.publish('track.ended');
            // this.skipForward();
        });

        this.play();
    }

    /**
     *
     */
    private publishPlayProgress() {
        if (this.player) {
            Promise.all(
                [
                    this.player.getCurrentPosition(),
                    this.player.getDuration(),
                    this.player.getCurrentAmplitude()
                ]
            ).then((values) => {
                // console.log(values);
                let currentTime = values[0];
                let duration = values[1]; // duration = -1 while loading
                let currentAmplitutde = values[2];
                let percentage = '0.00';

                if (currentTime >= 0 && duration >= 0) {
                    percentage = ((currentTime / duration) * 100).toFixed(2);
                }
                else {
                    currentTime = 0;
                    duration = 0;
                }

                this.events.publish('track.progress', {
                    percentage: percentage,
                    currentTime: currentTime,
                    duration: duration
                });
            });
        }
    }

    /**
     *
     * @param index
     */
    private removeQueueIndex(index: number) {
        this.queue.splice(index, 1);
        if (this.queueIndex >= index) {
            this.queueIndex -= 1;
        }
        this.publishQueueData();
    }

    /**
     *
     */
    private publishQueueData() {
        this.events.publish('queue.update', {
            queue: this.queue,
            queueIndex: this.queueIndex,
            canSkipForward: this.canSkipForward(),
            canSkipBackward: this.canSkipBackward()
        })
    }

    /**
     *
     */
    private updateMusicControls() {
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
    }
}
