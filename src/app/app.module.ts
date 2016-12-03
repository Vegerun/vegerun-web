/** 
 * This module is the entry for your App when NOT using universal.
 * 
 * Make sure to use the 3 constant APP_ imports so you don't have to keep
 * track of your root app dependencies here. Only import directly in this file if
 * there is something that is specific to the environment.  
 */

import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';

import { Store } from '@ngrx/store';

import { APP_DECLARATIONS } from './constants/app.declarations';
import { APP_ENTRY_COMPONENTS } from './constants/app.entry-components';
import { APP_IMPORTS } from './constants/app.imports';
import { APP_PROVIDERS } from './constants/app.providers';

import { AppComponent } from './app.component';

import { AppState } from './store';

@NgModule({
    declarations: [
      AppComponent,
      APP_DECLARATIONS
    ],
    entryComponents: [APP_ENTRY_COMPONENTS],
    imports: [
        APP_IMPORTS,
        BrowserModule,
        HttpModule,
    ],
    bootstrap: [AppComponent],
    providers: [APP_PROVIDERS]
})
export class AppModule {

    constructor(
        public appRef: ApplicationRef,
        private store: Store<AppState>) { }

    hmrOnInit(store) {
        if (!store || !store.rootState) return;

        this.store.dispatch({
            type: '[App] Update Root',
            payload: store.rootState
        });

        if (store.restoreInputValues) {
            store.restoreInputValues();
        }

        this.appRef.tick();
        Object.keys(store).forEach(prop => delete store[prop]);
    }

    hmrOnDestroy(store) {
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        this.store.first().subscribe(s => store.rootState = s);

        store.disposeOldHosts = createNewHosts(cmpLocation);
        store.restoreInputValues = createInputTransfer();

        removeNgStyles();
    }

    hmrAfterDestroy(store) {
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}
