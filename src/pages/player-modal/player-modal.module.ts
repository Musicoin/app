import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerModalPage } from './player-modal';

@NgModule({
  declarations: [
    PlayerModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerModalPage),
  ],
})
export class PlayerModalPageModule {}
