import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';

import { VegerunClient, Vegerun2Client, OrderItemComparer } from '../_lib/vegerun';

import { AppState } from '../store';
import { ErrorActions } from '../store/error/error.actions'
import { OrderState, OrderItemState, OrderActions, ORDER_ACTION_NAMES } from '../features/orders';
import {
    CreatePayload, CreateCompletedPayload,
    CreateItemPayload, CreateItemStartedPayload, CreateItemCompletedPayload, CreateItemFromRemovedPayload,
    UpdateItemPayload, UpdateItemStartedPayload, UpdateItemCompletedPayload,
    RemoveItemPayload, RemoveItemStartedPayload, RemoveItemCompletedPayload
} from '../features/orders/store/order.payloads';

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
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .switchMap(orderState => this.vegerunClient
                .apiV1OrdersCreatePost({ restaurantId: orderState.restaurantId })
                .map(o => this.orderActions.createCompleted(o))
                .catch(err => Observable.of(this.orderActions.createFailed(err)))));

    @Effect() orderCreateCompletedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.CREATE_COMPLETED)
        .flatMap(payload => toOrderStateSnapshot(this.store))
        .mergeMap(o => Observable.from(o.orderItems.map(oi => this.orderActions.createItemStarted(o, oi.id))));
    
    @Effect() createItemEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.CREATE_ITEM)
        .map<CreateItemPayload>(toPayload)
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .switchMap(orderState => {
                if (orderState.orderId === null) {
                    if (!orderState.loading) {
                        return Observable.of(this.orderActions.create(payload.restaurant));
                    } else {
                        return Observable.empty();
                    }
                } else {
                    return Observable.of(this.orderActions.createItemStarted(orderState, payload.orderItemStateId));
                }
            }));

    @Effect() updateItemEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.UPDATE_ITEM)
        .map<UpdateItemPayload>(toPayload)
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .switchMap(orderState => {
                let { orderItemStateId } = payload;
                let orderItemState = orderState.orderItems.find(ois => ois.id === orderItemStateId);
                if (orderItemState.loading || !orderItemState.server) {
                    // Creation of the item is in progress.
                    return Observable.empty();
                } else {
                    return Observable.of(this.orderActions.updateItemStarted(orderState, orderItemStateId));
                }
            }));

    @Effect() removeItemEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.REMOVE_ITEM)
        .map<RemoveItemPayload>(toPayload)
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .switchMap(orderState => {
                if (orderState.loading) {
                    // Order item hasn't been created so no need to delete it.
                    return Observable.empty();
                }
                
                let { orderItemStateId } = payload;
                let orderItemState = orderState.removedOrderItems.find(ois => ois.id === orderItemStateId);
                if (orderItemState.loading || !orderItemState.server) {
                    return Observable.empty();
                } else {
                    return Observable.of(this.orderActions.removeItemStarted(orderItemStateId));
                }
            }));

    @Effect() createItemStartedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.CREATE_ITEM_STARTED)
        .map<CreateItemStartedPayload>(toPayload)
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .switchMap(orderState => {
                let { orderItem, orderItemStateId } = payload;
                orderItem.orderId = orderState.orderId;
                return this.vegerun2Client
                    .apiV2OrdersItemsPut(orderItem)
                    .map(res => this.orderActions.createItemCompleted(orderItemStateId, res))
                    .catch(err => Observable.of(this.orderActions.createItemFailed(orderItemStateId, err, orderItem)))
            }));

    @Effect() updateItemStartedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.UPDATE_ITEM_STARTED)
        .map<UpdateItemStartedPayload>(toPayload)
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .switchMap(orderState => {
                let { orderItem, orderItemStateId } = payload;
                let orderItemState = orderState.orderItems.find(ois => ois.id === orderItemStateId);
                orderItem.id = orderItemState.server.id;
                return this.vegerun2Client
                    .apiV2OrdersItemsPost(orderItem)
                    .map(res => this.orderActions.updateItemCompleted(orderItemStateId, res))
                    .catch(err => Observable.of(this.orderActions.updateItemFailed(orderItemStateId, err, orderItem)));
            }));

    @Effect() removeItemStartedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.REMOVE_ITEM_STARTED)
        .map<RemoveItemStartedPayload>(toPayload)
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .switchMap(orderState => {
                let { orderItemStateId } = payload;
                let orderItemState = orderState.removedOrderItems.find(ois => ois.id === orderItemStateId);
                return this.vegerun2Client
                    .apiV2OrdersItemsByIdDelete(orderItemState.server.id)
                    .map(res => this.orderActions.removeItemCompleted(orderItemStateId))
                    .catch(err => Observable.of(this.orderActions.removeItemFailed(err)));
            }));

    @Effect() createOrUpdateItemCompletedEffect = this.actions$
        .ofType(
            ORDER_ACTION_NAMES.CREATE_ITEM_COMPLETED,
            ORDER_ACTION_NAMES.UPDATE_ITEM_COMPLETED
        )
        .map<CreateItemCompletedPayload | UpdateItemCompletedPayload>(toPayload)
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .flatMap((state: OrderState) => {
                let { orderItemStateId } = payload;
                let orderItemState = state.orderItems.find(ois => ois.id === orderItemStateId);
                if (!orderItemState) {
                    return Observable.of(this.orderActions.removeItemStarted(payload.orderItemStateId));
                } else if (!this.orderItemComparer.areEqual(orderItemState.local, orderItemState.server)) {
                    return Observable.of(this.orderActions.updateItem(state, payload.orderItemStateId, orderItemState.local));
                } else {
                    return Observable.empty();
                }
            }));

    @Effect() removeItemCompletedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.REMOVE_ITEM_COMPLETED)
        .map<RemoveItemCompletedPayload>(toPayload)
        .flatMap(payload => toOrderStateSnapshot(this.store)
            .flatMap(state => {
                let { orderItemStateId } = payload;
                let orderItemState = state.orderItems.find(ois => ois.id === orderItemStateId);
                if (orderItemState) {
                    // The removed item has been recreated
                    return Observable.of(this.orderActions.createItemStarted(state, orderItemStateId));
                } else {
                    return Observable.empty();
                }
            }));

    @Effect({ dispatch: false }) bubbleErrors = this.actions$
        .ofType(
            ORDER_ACTION_NAMES.CREATE_FAILED,
            ORDER_ACTION_NAMES.CREATE_ITEM_FAILED,
            ORDER_ACTION_NAMES.UPDATE_ITEM_FAILED,
            ORDER_ACTION_NAMES.REMOVE_ITEM_FAILED
        );
}

function toOrderStateSnapshot(store: Store<AppState>): Observable<OrderState> {
    return store.select(s => s.order).first();
}
