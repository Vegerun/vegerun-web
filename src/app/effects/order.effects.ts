import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';

import { VegerunClient, OrderResultV2 } from '../_lib/vegerun/_swagger-gen/v1';
import { Vegerun2Client, CustomerMenuItemResultV2, OrderItemResultV2, OrderItemCreateV2, OrderItemUpdateV2 } from '../_lib/vegerun/_swagger-gen/v2';
import { OrderItemComparer } from '../_lib/vegerun/orders';

import { AppState } from '../store';
import { OrderState, OrderItemState } from '../store/order';
import { ORDER_ACTION_NAMES, OrderActions } from '../store/order/order.actions';
import { ErrorActions } from '../store/error/error.actions'

import {
    CreatePayload, CreateCompletedPayload,
    CreateItemPayload, CreateItemPayloadStarted, CreateItemCompletedPayload,
    UpdateItemPayload, UpdateItemPayloadStarted, UpdateItemCompletedPayload,
} from '../store/order/order.payloads';

@Injectable()
export class OrderEffects {

    constructor(
        private store: Store<AppState>,
        private orderActions: OrderActions,
        private errorActions: ErrorActions, 
        private vegerunClient: VegerunClient,
        private vegerun2Client: Vegerun2Client,
        private orderItemComparer: OrderItemComparer,
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

    @Effect() orderCreateCompletedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.CREATE_COMPLETED)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first())
        .mergeMap(o => Observable.from(o.orderItems.map(oi =>
            this.orderActions.createItemStarted(o, oi.id))));
    
    @Effect() createItemEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.CREATE_ITEM)
        .map<CreateItemPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .switchMap(orderState => {
                if (orderState.orderId === null) {
                    if (!orderState.orderIdLoading) {
                        return Observable.of(this.orderActions.create(payload.restaurant));
                    } else {
                        return Observable.empty();
                    }
                } else {
                    return Observable.of(this.orderActions.createItemStarted(orderState, payload.orderItemStateId));
                }
            }));

    @Effect() createItemStartedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.CREATE_ITEM_STARTED)
        .map<CreateItemPayloadStarted>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .switchMap(orderState => {
                let { orderItem, orderItemStateId } = payload;
                orderItem.orderId = orderState.orderId;
                return this.vegerun2Client
                    .apiV2OrdersItemsPut(orderItem)
                    .map(res => this.orderActions.createItemCompleted(orderItemStateId, res))
                    .catch(err => Observable.of(this.orderActions.createItemFailed(orderItemStateId, err, orderItem)))
            }));

    @Effect() updateItemEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.UPDATE_ITEM)
        .map<UpdateItemPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .switchMap(orderState => {
                let { orderItemStateId } = payload;
                let orderItemState = orderState.orderItems.find(ois => ois.id === orderItemStateId);
                if (orderItemState.loading) {
                    return Observable.empty();
                } else {
                    return Observable.of(this.orderActions.updateItemStarted(orderState, orderItemStateId));
                }
            }));

    @Effect() updateItemStartedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.UPDATE_ITEM_STARTED)
        .map<UpdateItemPayloadStarted>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .switchMap(orderState => {
                let { orderItem, orderItemStateId } = payload;
                let orderItemState = orderState.orderItems.find(ois => ois.id === orderItemStateId);
                orderItem.id = orderItemState.server.id;
                return this.vegerun2Client
                    .apiV2OrdersItemsPost(orderItem)
                    .map(res => this.orderActions.updateItemCompleted(orderItemStateId, res))
                    .catch(err => Observable.of(this.orderActions.updateItemFailed(orderItemStateId, err, orderItem)));
            }));

    @Effect() createOrUpdateItemCompletedEffect = this.actions$
        .ofType(
            ORDER_ACTION_NAMES.CREATE_ITEM_COMPLETED,
            ORDER_ACTION_NAMES.UPDATE_ITEM_COMPLETED
        )
        .map<CreateItemCompletedPayload | UpdateItemCompletedPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .flatMap((orderState: OrderState) => {
                let { orderItemStateId } = payload;
                let orderItemState = orderState.orderItems.find(ois => ois.id === orderItemStateId);
                debugger;
                if (!orderItemState) {
                    return Observable.of(this.orderActions.deleteItem({}));
                } else if (!this.orderItemComparer.areEqual(orderItemState.local, orderItemState.server)) {
                    return Observable.of(this.orderActions.updateItem(orderState, payload.orderItemStateId, orderItemState.local));
                } else {
                    return Observable.empty();
                }
            }));

    @Effect() bubbleErrors = this.actions$
        .ofType(
            ORDER_ACTION_NAMES.CREATE_FAILED,
            ORDER_ACTION_NAMES.CREATE_ITEM_FAILED,
            ORDER_ACTION_NAMES.UPDATE_ITEM_FAILED
        )
        .map(p => Observable.of(this.errorActions.addError(p)));
}
