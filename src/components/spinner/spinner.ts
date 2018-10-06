import { Component } from '@angular/core';

/**
 * Generated class for the SpinnerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'spinner',
  templateUrl: 'spinner.html'
})
export class SpinnerComponent {

  text: string;

  constructor() {
    console.log('Hello SpinnerComponent Component');
    this.text = 'Hello World';
  }

}
