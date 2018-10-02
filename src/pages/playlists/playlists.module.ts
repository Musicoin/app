import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaylistsPage } from './playlists';

@NgModule({
  declarations: [
    PlaylistsPage,
  ],
  imports: [
    IonicPageModule.forChild(PlaylistsPage),
  ],
})
export class PlaylistsPageModule {}
