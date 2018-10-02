import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArtistPage } from './artist';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        ArtistPage,
    ],
    imports: [
        IonicPageModule.forChild(ArtistPage),
        ComponentsModule
    ],
})
export class ArtistPageModule {
}
