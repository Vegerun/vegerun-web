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
import { CreatePayload, CreateCompletedPayload, CreateItemPayload, SyncCreateItemPayload, SyncCreateItemCompletedPayload, UnblockItemPayload, UpdateItemPayload } from '../store/order/order.payloads';
import { ErrorActions } from '../store/error/error.actions'

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
        .map<CreateCompletedPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first())
        .mergeMap(o => Observable.from(o.orderItems.map(oi =>
            this.orderActions.syncCreateItem(o, oi.id))));
    
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
                    return Observable.of(this.orderActions.syncCreateItem(orderState, payload.orderItemStateId));
                }
            }));

    @Effect() syncCreateItemEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.SYNC_CREATE_ITEM)
        .map<SyncCreateItemPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .switchMap(orderState => {
                let { orderItem, orderItemStateId } = payload;
                orderItem.orderId = orderState.orderId;
                return this.vegerun2Client
                    .apiV2OrdersItemsPut(orderItem)
                    .map(orderItem => this.orderActions.syncCreateItemCompleted(orderState, orderItemStateId, orderItem))
                    .catch(err => Observable.of(this.orderActions.syncCreateItemFailed(orderItemStateId, err, orderItem)))
            }));

    @Effect() syncCreateItemCompletedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.SYNC_CREATE_ITEM_COMPLETED)
        .map<SyncCreateItemCompletedPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .flatMap((orderState: OrderState) => {
                let { orderItemStateId } = payload;
                let orderItemState = orderState.orderItems.find(ois => ois.id === orderItemStateId);
                if (!orderItemState) {
                    // TODO: trigger delete
                    return Observable.empty();
                } else if (this.orderItemComparer.areEqual(orderItemState.local, orderItemState.server)) {
                    // TODO: trigger update
                    return Observable.empty();
                } else {
                    return Observable.empty();
                }
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
                    return Observable.of(this.orderActions.syncUpdateItem());
                }
            }));


    // @Effect() itemUnblockedEffect = this.actions$
    //     .ofType(ORDER_ACTION_NAMES.UNBLOCK_ITEM)
    //     .map<UnblockItemPayload>(toPayload)
    //     .flatMap(payload => this.store
    //         .select(s => s.order)
    //         .first()
    //         .switchMap(orderState =>
    //             this.createItem(payload.orderItem, orderState)));

    // @Effect() updateItemEffect = this.actions$
    //     .ofType(ORDER_ACTION_NAMES.UPDATE_ITEM)
    //     .map<UpdateItemPayload>(toPayload)
    //     .flatMap(payload => this.store
    //         .select(s => s.order)
    //         .first()
    //         .concatMap((orderState: OrderState) => Observable.from([ // if not loading... trigger load
    //             this.updateItem(payload.index, orderState)
    //         ])));

    @Effect({ dispatch: false }) bubbleErrors = this.actions$
        .ofType(
            ORDER_ACTION_NAMES.CREATE_FAILED,
            ORDER_ACTION_NAMES.SYNC_CREATE_ITEM_FAILED,
            ORDER_ACTION_NAMES.SYNC_UPDATE_ITEM_FAILED
        )
        .map(e => {
            return {};
        });

    

    // private updateItem(index: number, orderState: OrderState): Observable<Action> {
    //     let orderItemState = orderState.orderItems[index];
    //     let data = Object.assign({}, orderItemState.local, <OrderItemUpdateV2>{
    //         id: orderItemState.server.id
    //     });
    //     return this.vegerun2Client
    //         .apiV2OrdersItemsPost(data)
    //         .map(orderItem => this.orderActions.loadItemCompleted(orderState, orderItem))
    //         .catch(err => Observable.of(this.orderActions.loadItemFailed(err, data)));
    // }
}
