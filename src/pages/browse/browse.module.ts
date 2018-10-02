import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrowsePage } from './browse';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        BrowsePage,
    ],
    imports: [
        IonicPageModule.forChild(BrowsePage),
        ComponentsModule
    ],
})
export class BrowsePageModule {
}
