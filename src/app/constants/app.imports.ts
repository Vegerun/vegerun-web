import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';

//import { EffectsModule } from '@ngrx/effects';
//import { RouterStoreModule } from '@ngrx/router-store';
//import { StoreModule } from '@ngrx/store';
//import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { useLogMonitor } from '@ngrx/store-log-monitor';

import { APP_ROUTES } from './app.routes';
import { APP_EFFECTS } from '../effects';
//import { rootReducer } from '../reducers';
//import { StoreDevToolsModule } from '../features/store-devtools.module';
//import { UserEffects } from '../user/user.effects';

// const STORE_DEV_TOOLS_IMPORTS = [];
// if (ENV === 'development' && !AOT &&
//   ['monitor', 'both'].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
// ) STORE_DEV_TOOLS_IMPORTS.push(...[
//   StoreDevtoolsModule.instrumentStore({
//     monitor: useLogMonitor({
//       visible: true,
//       position: 'right'
//     })
//   })
// ]);

// export const APP_IMPORTS = [
//     EffectsModule.run(UserEffects),
//     MaterialModule.forRoot(),
//     ReactiveFormsModule,
//     RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules }),
//     RouterStoreModule.connectRouter(),
//     StoreModule.provideStore(rootReducer),
//     STORE_DEV_TOOLS_IMPORTS,
//     StoreDevToolsModule
// ];

import { AppStoreModule } from '../store/app-store.module';

export const APP_IMPORTS = [
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules }),
    AppStoreModule,
    APP_EFFECTS.map(effect => EffectsModule.run(effect))
];