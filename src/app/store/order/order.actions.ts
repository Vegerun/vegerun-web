import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { OrderItemFactory, OrderItemComparer } from '../../_lib/vegerun/orders';
import { OrderResult } from '../../_lib/vegerun/_swagger-gen/v1';
import { CustomerMenuItemResultV2, RestaurantResultV2, OrderItemCreateV2 , OrderItemResultV2, OrderItemUpdateV2 } from '../../_lib/vegerun/_swagger-gen/v2';

import { OrderState, OrderItemState } from './order.state';

import {
    CreatePayload, CreateCompletedPayload,
    CreateItemPayload, ItemBlockedOnOrderPayload, UpdateItemPayload, SyncCreateItemPayload, SyncCreateItemCompletedPayload
} from './order.payloads';

const prefix = action => `[Order] ${action}`;
const status = (parentActionName, status) => `${parentActionName} - ${status}`;
const completed = actionName => status(actionName, 'Completed');
const failed = actionName => status(actionName, 'Failed');
const blocked = actionName => status(actionName, 'Blocked');
const sync = actionName => status(actionName, 'Synchronizing');

const CREATE = prefix('Create');
const CREATE_COMPLETED = completed(CREATE);
const CREATE_FAILED = failed(CREATE);

const CREATE_ITEM = prefix('Create Item');
const SYNC_CREATE_ITEM = sync(CREATE_ITEM);
const SYNC_CREATE_ITEM_COMPLETED = completed(SYNC_CREATE_ITEM);
const SYNC_CREATE_ITEM_FAILED = failed(SYNC_CREATE_ITEM);

const UPDATE_ITEM = prefix('Update Item');
const SYNC_UPDATE_ITEM = sync(UPDATE_ITEM);
const SYNC_UPDATE_ITEM_COMPLETED = completed(SYNC_UPDATE_ITEM);
const SYNC_UPDATE_ITEM_FAILED = failed(SYNC_UPDATE_ITEM);

const LOAD_ITEM = prefix('Load Item');
const LOAD_ITEM_COMPLETED = completed(LOAD_ITEM);
const LOAD_ITEM_FAILED = failed(LOAD_ITEM);
const REMOVE_ITEM = prefix('Remove Item');
const UPDATE_ITEM_COUNT = prefix('Update Item Count');

export const ORDER_ACTION_NAMES = {
    CREATE,
    CREATE_COMPLETED,
    CREATE_FAILED,

    CREATE_ITEM,
    SYNC_CREATE_ITEM,
    SYNC_CREATE_ITEM_COMPLETED,
    SYNC_CREATE_ITEM_FAILED,

    UPDATE_ITEM,
    SYNC_UPDATE_ITEM,
    SYNC_UPDATE_ITEM_COMPLETED,
    SYNC_UPDATE_ITEM_FAILED,
    
    REMOVE_ITEM,
    UPDATE_ITEM_COUNT
};

let currentOrderItemStateId = 0;

@Injectable()
export class OrderActions {

    constructor(
        private orderItemFactory: OrderItemFactory,
        private orderItemComparer: OrderItemComparer
    ) { }

    create(restaurant: RestaurantResultV2): Action {
        return {
            type: CREATE,
            payload: <CreatePayload>{
                restaurantId: restaurant.id
            }
        };
    }

    createCompleted(order: OrderResult): Action {
        return {
            type: CREATE_COMPLETED,
            payload: <CreateCompletedPayload>{
                orderId: order.id
            }
        };
    }

    createFailed(error: any): Action {
        return {
            type: CREATE_FAILED,
            payload: error
        };
    }

    createItem(state: OrderState, item: CustomerMenuItemResultV2, restaurant: RestaurantResultV2): Action {
        let orderItem = this.orderItemFactory.createOrderItem(item);
        let orderItemStateMatch = this.findOrderItemState(state, orderItem);
        if (orderItemStateMatch) {
            let { id, local } = orderItemStateMatch.orderItemState;
            return {
                type: UPDATE_ITEM,
                payload: <UpdateItemPayload>{
                    orderItemStateId: id,
                    orderItem: <OrderItemUpdateV2>{
                        count: local.count + 1
                    }
                }
            };
        } else {
            let orderItemStateId = currentOrderItemStateId++;
            return {
                type: CREATE_ITEM,
                payload: <CreateItemPayload>{
                    orderItemStateId,
                    orderItem,
                    restaurant
                }
            };
        }
    }

    syncCreateItem(state: OrderState, orderItemStateId: number): Action {
        let orderItemState = state.orderItems.find(ois => ois.id === orderItemStateId);
        return {
            type: SYNC_CREATE_ITEM,
            payload: <SyncCreateItemPayload>{
                orderItemStateId,
                orderItem: orderItemState.local,
            }
        };
    }

    syncCreateItemCompleted(state: OrderState, orderItemStateId: number, orderItem: OrderItemResultV2): Action {
        return {
            type: SYNC_CREATE_ITEM_COMPLETED,
            payload: <SyncCreateItemCompletedPayload>{
                orderItemStateId,
                orderItem
            }
        };
    }

    syncCreateItemFailed(orderItemStateId: number, error: any, orderItem: OrderItemCreateV2): Action {
        return {
            type: SYNC_CREATE_ITEM_FAILED,
            payload: {
                orderItemStateId,
                orderItem,
                error
            }
        };
    }

    updateItem(state: OrderState, orderItemStateId: number, orderItem: OrderItemUpdateV2): Action {
        let orderItemState = state.orderItems.find(ois => ois.id === orderItemStateId);
        return {
            type: UPDATE_ITEM,
            payload: <UpdateItemPayload>{
                orderItemStateId,
                orderItem
            }
        };
    }

    syncUpdateItem(/*state: OrderState, orderItemStateId: number, orderItem: OrderItemUpdateV2*/): Action {
        // let orderItemState = state.orderItems.find(ois => ois.id === orderItemStateId);
        return {
            type: SYNC_UPDATE_ITEM,
            payload: {
                // orderItemStateId,
                // orderItem
            }
        };
    }


    

    removeItem(item: any /* OrderItem */): Action {
        return {
            type: ORDER_ACTION_NAMES.REMOVE_ITEM,
            payload: item.id
        };
    }

    incrementItem(item: any /* OrderItem */): Action {
        return this.updateItemCount(item, 1);
    }

    decrementItem(item: any /* OrderItem */): Action {
        if (item.count === 1) {
            return this.removeItem(item);
        } else {
            return this.updateItemCount(item, -1);
        }
    }

    private findOrderItemState(state: OrderState, orderItem: OrderItemCreateV2 | OrderItemResultV2): OrderItemStateMatch {
        let index = state.orderItems.findIndex(ois => this.orderItemComparer.areContentsEqual(ois.local, orderItem));
        if (index > -1) {
            return {
                index,
                orderItemState: state.orderItems[index]
            }
        } else {
            return null;
        }
    }

    private updateItemCount(item: any, magnitude: Number): Action {
        return {
            type: UPDATE_ITEM_COUNT,
            payload: {
                id: item.id,
                count: item.count + magnitude
            }
        }
    }
}

interface OrderItemStateMatch {
    index: number;

    orderItemState: OrderItemState;
}