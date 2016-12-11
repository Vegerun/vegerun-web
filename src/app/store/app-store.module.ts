import { NgModule } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { compose } from '@ngrx/core';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, RouterState } from '@ngrx/router-store';

import { errorReducer, ErrorState, ErrorActions } from './error';
import { orderReducer, OrderState } from '../features/orders/store';
import { authReducer, AuthState } from '../features/auth';

export interface AppState {
    router: RouterState,
    error: ErrorState,
    order: OrderState,
    auth: AuthState
}

@NgModule({
    imports: [
        StoreModule.provideStore(compose(combineReducers)({
            router: routerReducer,
            error: errorReducer,
            order: orderReducer,
            auth: authReducer
        }))
    ],
    providers: [
        ErrorActions
    ]
})
export class AppStoreModule { }