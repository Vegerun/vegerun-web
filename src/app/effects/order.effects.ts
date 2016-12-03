import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';

import { Vegerun2Client, CustomerMenuItemResultV2 } from '../vegerun-2-client';

import { AppState } from '../store';
import { ORDER_ACTION_NAMES, OrderActions } from '../store/order/order.actions';
import { ErrorActions } from '../store/error/error.actions'

const error = Observable.from(new Promise((resolve, reject) => {
    reject('error!')
}));

@Injectable()
export class OrderEffects {

    constructor(
        private store: Store<AppState>,
        private orderActions: OrderActions,
        private errorActions: ErrorActions, 
        private actions$: Actions
    ) { }

    @Effect() persistAddItem$ = this.actions$
        .ofType(ORDER_ACTION_NAMES.ADD_ITEM)
        .map(toPayload)
        .switchMap((item: CustomerMenuItemResultV2) =>
            error
                .map(orderItem => this.orderActions.addItemCompleted(item, orderItem))
                .catch(err => Observable.of(this.orderActions.addItemFailed(item, err)))
        );
    
    @Effect() registerAddItemError$ = this.actions$
        .ofType(ORDER_ACTION_NAMES.ADD_ITEM_FAILED)
        .map(action => this.errorActions.addError(action.payload.error));
}
