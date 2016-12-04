import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';

import { VegerunClient, OrderResultV2 } from '../_lib/vegerun/_swagger-gen/v1';
import { Vegerun2Client, CustomerMenuItemResultV2, OrderItemResultV2, OrderItemCreateV2 } from '../_lib/vegerun/_swagger-gen/v2';
import { OrderItemComparer } from '../_lib/vegerun/orders';

import { AppState } from '../store';
import { OrderState, OrderItemState } from '../store/order';
import { ORDER_ACTION_NAMES, OrderActions } from '../store/order/order.actions';
import { CreatePayload, CreateCompletedPayload, AddItemPayload, LoadItemPayload, LoadItemCompletedPayload, UnblockItemPayload } from '../store/order/order.payloads';
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
            .first()
        .mergeMap(o => Observable.from(this.orderActions.unblockItems(o))));
    
    @Effect() addItemEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.ADD_ITEM)
        .map<AddItemPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .mergeMap(orderState => {
                let actions: Action[] = [];
                if (orderState.orderId === null) {
                    if (!orderState.orderIdLoading) {
                        actions.push(this.orderActions.create(payload.restaurant));
                    }
                    actions.push(this.orderActions.blockItemOnOrder(orderState, payload.orderItem));
                } else {
                    actions.push(this.orderActions.loadItem(payload.orderItem, orderState.orderId));
                }
                return Observable.from(actions);
            }));

    @Effect() itemUnblockedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.UNBLOCK_ITEM)
        .map<UnblockItemPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order)
            .first()
            .switchMap(orderState =>
                this.createItem(payload.orderItem, orderState)));

    @Effect() itemLoadCompletedEffect = this.actions$
        .ofType(ORDER_ACTION_NAMES.LOAD_ITEM_COMPLETED)
        .map<LoadItemCompletedPayload>(toPayload)
        .flatMap(payload => this.store
            .select(s => s.order.orderItems[payload.index]))
        .flatMap((orderItemState: OrderItemState) =>
            this.orderItemComparer.areEqual(orderItemState.local, orderItemState.server) ?
                Observable.empty() :
                Observable.of(this.orderActions.updateItem(orderItemState)));
    
    // @Effect() loadItemEffect = this.actions$
    //     .ofType(ORDER_ACTION_NAMES.LOAD_ITEM)
    //     .map<LoadItemPayload>(toPayload)
    //     .switchMap(payload => {
    //         let data = Object.assign({}, payload.orderItem, {
    //             orderId: payload.orderId
    //         });

    //         return this.vegerun2Client
    //             .apiV2OrdersItemsPut(data)
    //             .map(orderItem => this.orderActions.loadItemCompleted(orderItem))
    //             .catch(err => Observable.of(this.orderActions.loadItemFailed(err, data)))
    //     });

    @Effect({ dispatch: false }) bubbleErrors = this.actions$
        .ofType(
            ORDER_ACTION_NAMES.CREATE_FAILED,
            ORDER_ACTION_NAMES.LOAD_ITEM_FAILED
        )
        .map(e => {
            return {};
        });

    private createItem(orderItem: OrderItemCreateV2, orderState: OrderState): Observable<Action> {
        orderItem.orderId = orderState.orderId;
        return this.vegerun2Client
            .apiV2OrdersItemsPut(orderItem)
            .map(orderItem => this.orderActions.loadItemCompleted(orderState, orderItem))
            .catch(err => Observable.of(this.orderActions.loadItemFailed(err, orderItem)))
    }
}
