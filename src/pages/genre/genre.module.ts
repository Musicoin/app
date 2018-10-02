import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GenrePage } from './genre';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        GenrePage,
    ],
    imports: [
        IonicPageModule.forChild(GenrePage),
        ComponentsModule
    ],
})
export class GenrePageModule {
}
