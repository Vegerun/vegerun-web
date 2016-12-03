import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';

import { VegerunClient, OrderResultV2 } from '../vegerun-client';
import { Vegerun2Client, CustomerMenuItemResultV2, OrderItemResultV2, OrderItemCreateV2 } from '../vegerun-2-client';

import { AppState } from '../store';
import { OrderState, OrderItemState, OrderItemPersistence } from '../store/order';
import { ORDER_ACTION_NAMES, OrderActions } from '../store/order/order.actions';
import { AddItemPayload, CreatePayload, CreateCompletedPayload } from '../store/order/order.payloads';
import { ErrorActions } from '../store/error/error.actions'

@Injectable()
export class OrderEffects {

    constructor(
        private store: Store<AppState>,
        private orderActions: OrderActions,
        private errorActions: ErrorActions, 
        private vegerunClient: VegerunClient,
        private vegerun2Client: Vegerun2Client,
        private actions$: Actions
    )
    {
        this.orderCreatedCompletedEffect.subscribe(res => {
            debugger;
        });
    }

    @Effect() orderCreateEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.CREATE)
        .map<CreatePayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .switchMap(orderState => this.vegerunClient
                .apiV1OrdersCreatePost({ restaurantId: orderState.restaurantId })
                .map(o => this.orderActions.createCompleted(o))
                .catch(err => Observable.of(this.orderActions.createFailed(err)))));

    @Effect() orderCreatedCompletedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.CREATE_COMPLETED)
        .map<CreateCompletedPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first())
        .mergeMap(o => {
            let actions = o.orderItems
                .filter(i => i.status === OrderItemPersistence.PreLoading)
                .map(i => ({ type: 'HI!!!', payload: {}}))
                //.map(i => this.persistOrderItem(i.data, o.orderId));
            return Observable.from(actions);
        });

    @Effect() persistItem$ = this.actions$
        .ofType(ORDER_ACTION_NAMES.ADD_ITEM)
        .map<AddItemPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .switchMap(orderState => {
                if (orderState.orderId === null) {
                    if (orderState.orderIdLoading) {
                        return Observable.empty();
                    } else {
                        return Observable.of(this.orderActions.create(payload.restaurant));
                    }
                } else {
                    return this.persistOrderItem(payload.orderItem, orderState.orderId);
                }
            })
        );

    @Effect() bubbleErrors = this.actions$
        .ofType(
            ORDER_ACTION_NAMES.CREATE_FAILED,
            ORDER_ACTION_NAMES.ADD_ITEM_FAILED
        )
        .mapTo(this.errorActions.addError);

    private persistOrderItem(item: OrderItemCreateV2, orderId: string): Observable<Action> {
        item.orderId = orderId;
        return this.vegerun2Client
            .apiV2OrdersItemsPut(item)
            .map(orderItem => this.orderActions.addItemCompleted(item, orderItem))
            .catch(err => Observable.of(this.orderActions.addItemFailed(item, err)))
    }
}
