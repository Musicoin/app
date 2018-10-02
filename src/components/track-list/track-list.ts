import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from "../../models/track";

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
    @Output() trackClickEvent = new EventEmitter<Track>();

    constructor() {
        //
    }

    onTrackClick(track) {
        this.trackClickEvent.emit(track);
    }

}
