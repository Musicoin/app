import { Component, Input } from '@angular/core';

/**
 * Generated class for the BannerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'banner',
    templateUrl: 'banner.html'
})
export class BannerComponent {

    @Input() title: string;

    constructor() {
        //
    }

}
