import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopTracksPage } from './top-tracks';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        TopTracksPage,
    ],
    imports: [
        IonicPageModule.forChild(TopTracksPage),
        ComponentsModule
    ],
})
export class TopTracksPageModule {
}
