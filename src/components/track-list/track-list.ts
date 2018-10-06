import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from "../../models/track";
import { Events } from "ionic-angular";

/**
 * Generated class for the TrackListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'track-list',
    templateUrl: 'track-list.html'
})
export class TrackListComponent {

    @Input() tracks: Array<Track> = [];
    @Input() loading: boolean = false;
    @Input() showNoTracksMessage: boolean = false;

    @Output() trackClickEvent = new EventEmitter<Track>();

    constructor(public events: Events) {
        //
    }

    onTrackClick(track) {
        this.trackClickEvent.emit(track);
    }

    onAddAllTap() {
        this.events.publish('queue.tracks', this.tracks);
    }
}
