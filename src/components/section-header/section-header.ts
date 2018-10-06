import { Component, Input } from '@angular/core';

/**
 * Generated class for the SectionHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
    selector: 'section-header',
    templateUrl: 'section-header.html'
})
export class SectionHeaderComponent {

    @Input() title: string = '';
    @Input() showMore: boolean = false;

    constructor() {
        //
    }

}
