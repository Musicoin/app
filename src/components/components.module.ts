import { NgModule } from '@angular/core';
import { MiniPlayerComponent } from './mini-player/mini-player';
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";
import { TrackListComponent } from './track-list/track-list';
import { BannerComponent } from './banner/banner';

@NgModule({
    declarations: [
        MiniPlayerComponent,
        TrackListComponent,
    BannerComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        MiniPlayerComponent,
        TrackListComponent,
    BannerComponent
    ]
})
export class ComponentsModule {
}
