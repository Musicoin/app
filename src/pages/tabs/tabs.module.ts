import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabsPage } from './tabs';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        TabsPage,
    ],
    imports: [
        IonicPageModule.forChild(TabsPage),
        ComponentsModule
    ],
    exports: [
        TabsPage
    ]
})
export class TabsPageModule {
}
