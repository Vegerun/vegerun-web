import { NgModule } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { compose } from '@ngrx/core';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, RouterState } from '@ngrx/router-store';

import { orderReducer, OrderState, OrderActions } from './order';
import { errorReducer, ErrorState, ErrorActions } from './error';

export interface AppState {
    router: RouterState,
    order: OrderState,
    error: ErrorState
}

@NgModule({
    imports: [
        StoreModule.provideStore(compose(combineReducers)({
            router: routerReducer,
            order: orderReducer,
            error: errorReducer
        }))
    ],
    providers: [
        OrderActions,
        ErrorActions
    ]
})
export class AppStoreModule { }