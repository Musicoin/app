import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        SearchPage,
    ],
    imports: [
        IonicPageModule.forChild(SearchPage),
        ComponentsModule
    ],
})
export class SearchPageModule {
}
