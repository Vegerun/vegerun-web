/* tslint:disable: max-line-length */
import { Routes } from '@angular/router';

import { HomeComponent } from '../pages/home/home.component';
import { ErrorNotFoundComponent } from '../pages/error-not-found/error-not-found.component';
import { SearchComponent, SearchComponentResolve } from '../pages/search';
import { OrderComponent, OrderComponentResolve } from '../pages/order';

export const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'search/:townSlug/:postcode',
        component: SearchComponent,
        resolve: {
            search: SearchComponentResolve
        }
    },
    {
        path: 'search/:townSlug/:postcode/:restaurantSlug',
        component: OrderComponent,
        resolve: {
            order: OrderComponentResolve
        }
    },
    {
        path: 'checkout',
        loadChildren: '../features/checkout/index#CheckoutModule'
    },
    {
        path: '**',
        component: ErrorNotFoundComponent
    }

    // {
    //     path: 'lazy',
    //     loadChildren: '../features/lazy/index#LazyModule'
    // },
    // {
    //     path: 'sync',
    //     loadChildren: '../features/sync/index#SyncModule?sync=true'
    // }
];
