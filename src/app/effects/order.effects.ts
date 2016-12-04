import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';

import { VegerunClient, OrderResultV2 } from '../vegerun-client';
import { Vegerun2Client, CustomerMenuItemResultV2, OrderItemResultV2, OrderItemCreateV2 } from '../vegerun-2-client';

import { AppState } from '../store';
import { OrderState, OrderItemState, OrderItemAdditionStatus } from '../store/order';
import { ORDER_ACTION_NAMES, OrderActions } from '../store/order/order.actions';
import { CreatePayload, CreateCompletedPayload, AddItemPayload, LoadItemPayload } from '../store/order/order.payloads';
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
    ) { }

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
                .filter(i => i.additionStatus === OrderItemAdditionStatus.Added)
                .map(i => this.orderActions.loadItem(i.data, o.orderId))
            return Observable.from(actions);
        });
    
    @Effect() addItemEffect = this.actions$
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
                    return Observable.of(this.orderActions.loadItem(payload.orderItem, orderState.orderId));
                }
            }));
    
    @Effect() loadItemEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.LOAD_ITEM)
        .map<LoadItemPayload>(toPayload)
        .switchMap(payload => {
            let data = Object.assign({}, payload.orderItem, {
                orderId: payload.orderId
            });

            return this.vegerun2Client
                .apiV2OrdersItemsPut(data)
                .map(orderItem => this.orderActions.loadItemCompleted(orderItem))
                .catch(err => Observable.of(this.orderActions.loadItemFailed(err, data)))
        });

    @Effect() bubbleErrors = this.actions$
        .ofType(
            ORDER_ACTION_NAMES.CREATE_FAILED,
            ORDER_ACTION_NAMES.LOAD_ITEM_FAILED
        )
        .map(e => {
            return {};
        });
}
