import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreLogMonitorModule, useLogMonitor } from '@ngrx/store-log-monitor';

import { AppStoreModule } from '../store/app-store.module';

import { APP_ROUTES } from './app.routes';
import { APP_EFFECTS } from '../effects';

let DEV_APP_IMPORTS = [];
if (ENV === 'development') {
    DEV_APP_IMPORTS = [
        StoreDevtoolsModule.instrumentStore({
            monitor: useLogMonitor({
                visible: true,
                position: 'right'
            })
        }),
        StoreLogMonitorModule
    ]
}

export const APP_IMPORTS = [
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules }),
    AppStoreModule,
    APP_EFFECTS.map(effect => EffectsModule.run(effect)),
    ...DEV_APP_IMPORTS
];