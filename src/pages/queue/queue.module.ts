import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QueuePage } from './queue';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        QueuePage,
    ],
    imports: [
        IonicPageModule.forChild(QueuePage),
        ComponentsModule
    ],
})
export class QueuePageModule {
}
