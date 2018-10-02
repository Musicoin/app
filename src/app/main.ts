import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';
import { enableProdMode } from "@angular/core";
import { ENV } from "@app/env";

// this is the magic wand
if (ENV.DEBUG == false) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
