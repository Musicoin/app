import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebugPage } from './debug';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        DebugPage,
    ],
    imports: [
        IonicPageModule.forChild(DebugPage),
        ComponentsModule
    ],
})
export class DebugPageModule {
    //
}
