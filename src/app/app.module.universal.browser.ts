/** 
 * This module is the entry for your App BROWSER when in UNIVERSAL mode.
 * 
 * Make sure to use the 3 constant APP_ imports so you don't have to keep
 * track of your root app dependencies here. Only import directly in this file if
 * there is something that is specific to the environment.  
 */

import { NgModule } from '@angular/core';
import { UniversalModule } from 'angular2-universal';

import { APP_DECLARATIONS } from './constants/app.declarations';
import { APP_ENTRY_COMPONENTS } from './constants/app.entry-components';
import { APP_IMPORTS } from './constants/app.imports';
import { APP_PROVIDERS } from './constants/app.providers';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    APP_DECLARATIONS
  ],
  entryComponents: [APP_ENTRY_COMPONENTS],
  imports: [
    APP_IMPORTS,
    UniversalModule // NodeModule, NodeHttpModule, and NodeJsonpModule are included
  ],
  bootstrap: [AppComponent],
  providers: [APP_PROVIDERS]
})
export class AppModule { }

