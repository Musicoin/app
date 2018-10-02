import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebugPage } from './debug';

@NgModule({
  declarations: [
    DebugPage,
  ],
  imports: [
    IonicPageModule.forChild(DebugPage),
  ],
})
export class DebugPageModule {}
