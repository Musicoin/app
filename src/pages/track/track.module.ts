import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackPage } from './track';

@NgModule({
  declarations: [
    TrackPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackPage),
  ],
})
export class TrackPageModule {}
