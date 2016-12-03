import { NgModule } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { compose } from '@ngrx/core';
import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { routerReducer, RouterState } from '@ngrx/router-store';

import { orderReducer, OrderState, OrderActions } from './order';

export interface AppState {
    router: RouterState,
    order: OrderState 
}

const composeStore = compose(combineReducers)({
    router: routerReducer,
    order: orderReducer
});

@NgModule({
    imports: [
        StoreModule.provideStore(composeStore),

    ],
    providers: [
        OrderActions
    ]
})
export class AppStoreModule { }