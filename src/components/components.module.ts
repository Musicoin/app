import { NgModule } from '@angular/core';
import { MiniPlayerComponent } from './mini-player/mini-player';
import { CommonModule } from "@angular/common";
import { IonicModule } from "ionic-angular";
import { TrackListComponent } from './track-list/track-list';
import { BannerComponent } from './banner/banner';
import { SectionHeaderComponent } from './section-header/section-header';
import { SpinnerComponent } from './spinner/spinner';

@NgModule({
    declarations: [
        MiniPlayerComponent,
        TrackListComponent,
        BannerComponent,
        SectionHeaderComponent,
    SpinnerComponent
    ],
    imports: [
        CommonModule,
        IonicModule
    ],
    exports: [
        MiniPlayerComponent,
        TrackListComponent,
        BannerComponent,
        SectionHeaderComponent,
    SpinnerComponent
    ]
})
export class ComponentsModule {
}
