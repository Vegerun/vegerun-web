/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { DashboardComponent } from '../features/dashboard.component';

import { HomeComponent } from '../pages/home/home.component';
import { ErrorNotFoundComponent } from '../pages/error-not-found/error-not-found.component';
import { SearchComponent } from '../pages/search/search.component';

import { LocationResolve } from '../resolves/location.resolve';

export const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'search/:townName/:postcode',
        component: SearchComponent,
        resolve: {
            location: LocationResolve
        }
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'lazy',
        loadChildren: '../features/lazy/index#LazyModule'
    },
    {
        path: 'sync',
        loadChildren: '../features/sync/index#SyncModule?sync=true'
    },
    {
        path: '**',
        component: ErrorNotFoundComponent
    }
];
