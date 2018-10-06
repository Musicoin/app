import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlaylistsPage } from './playlists';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        PlaylistsPage,
    ],
    imports: [
        IonicPageModule.forChild(PlaylistsPage),
        ComponentsModule
    ],
})
export class PlaylistsPageModule {
    //
}
