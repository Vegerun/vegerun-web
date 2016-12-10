import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { OrderItemFactory, OrderItemComparer } from '../../_lib/vegerun/orders';
import { OrderResult } from '../../_lib/vegerun/_swagger-gen/v1';
import { CustomerMenuItemResultV2, RestaurantResultV2, OrderItemCreateV2 , OrderItemResultV2, OrderItemUpdateV2 } from '../../_lib/vegerun/_swagger-gen/v2';

import { OrderState, OrderItemState } from './order.state';

import {
    CreatePayload, CreateCompletedPayload,
    CreateItemPayload, CreateItemPayloadStarted, CreateItemCompletedPayload, CreateItemFailedPayload,
    UpdateItemPayload, UpdateItemPayloadStarted, UpdateItemCompletedPayload, UpdateItemFailedPayload 
} from './order.payloads';

const prefix = action => `[Order] ${action}`;
const status = (parentActionName, status) => `${parentActionName} - ${status}`;
const started = actionName => status(actionName, 'Started');
const completed = actionName => status(actionName, 'Completed');
const failed = actionName => status(actionName, 'Failed');

const CREATE = prefix('Create');
const CREATE_COMPLETED = completed(CREATE);
const CREATE_FAILED = failed(CREATE);

const CREATE_ITEM = prefix('Create Item');
const CREATE_ITEM_STARTED = started(CREATE_ITEM);
const CREATE_ITEM_COMPLETED = completed(CREATE_ITEM);
const CREATE_ITEM_FAILED = failed(CREATE_ITEM);

const UPDATE_ITEM = prefix('Update Item');
const UPDATE_ITEM_STARTED = started(UPDATE_ITEM);
const UPDATE_ITEM_COMPLETED = completed(UPDATE_ITEM);
const UPDATE_ITEM_FAILED = failed(UPDATE_ITEM);

const REMOVE_ITEM = prefix('Remove Item');

export const ORDER_ACTION_NAMES = {
    CREATE,
    CREATE_COMPLETED,
    CREATE_FAILED,

    CREATE_ITEM,
    CREATE_ITEM_STARTED,
    CREATE_ITEM_COMPLETED,
    CREATE_ITEM_FAILED,

    UPDATE_ITEM,
    UPDATE_ITEM_STARTED,
    UPDATE_ITEM_COMPLETED,
    UPDATE_ITEM_FAILED,
    
    REMOVE_ITEM
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
        let existingOrderItemState = state.orderItems.find(ois => this.orderItemComparer.areContentsEqual(ois.local, orderItem));
        if (existingOrderItemState) {
            let { id, local } = existingOrderItemState;
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
            let orderItemStateId = ++currentOrderItemStateId;
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

    createItemStarted(state: OrderState, orderItemStateId: number): Action {
        let orderItemState = state.orderItems.find(ois => ois.id === orderItemStateId);
        return {
            type: CREATE_ITEM_STARTED,
            payload: <CreateItemPayloadStarted>{
                orderItemStateId,
                orderItem: orderItemState.local,
            }
        };
    }

    createItemCompleted(orderItemStateId: number, orderItem: OrderItemResultV2): Action {
        return {
            type: CREATE_ITEM_COMPLETED,
            payload: <CreateItemCompletedPayload>{
                orderItemStateId,
                orderItem
            }
        };
    }

    createItemFailed(orderItemStateId: number, error: any, orderItem: OrderItemCreateV2): Action {
        return {
            type: CREATE_ITEM_FAILED,
            payload: <CreateItemFailedPayload>{
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

    updateItemStarted(state: OrderState, orderItemStateId: number): Action {
        let orderItemState = state.orderItems.find(ois => ois.id === orderItemStateId);
        return {
            type: UPDATE_ITEM_STARTED,
            payload: <UpdateItemPayloadStarted>{
                orderItemStateId,
                orderItem: <OrderItemUpdateV2>orderItemState.local
            }
        };
    }

    incrementItem(state: OrderState, orderItemStateId: number): Action {
        let item = this.getOrderItemState(state, orderItemStateId);
        return this.updateItemCount(item, 1);
    }

    decrementItem(state: OrderState, orderItemStateId: number): Action {
        let item = this.getOrderItemState(state, orderItemStateId);
        if (item.local.count === 1) {
            return this.deleteItem(state, orderItemStateId);
        } else {
            return this.updateItemCount(item, -1);
        }
    }

    updateItemCompleted(orderItemStateId: number, orderItem: OrderItemResultV2): Action {
        return {
            type: UPDATE_ITEM_COMPLETED,
            payload: <UpdateItemCompletedPayload>{
                orderItemStateId,
                orderItem
            }
        };
    }

    updateItemFailed(orderItemStateId: number, error: any, orderItem: OrderItemCreateV2): Action {
        return {
            type: UPDATE_ITEM_FAILED,
            payload: <UpdateItemFailedPayload>{
                orderItemStateId,
                orderItem,
                error
            }
        };
    }

    deleteItem(state: OrderState, orderItemStateId: number): Action {
        return {
            type: ORDER_ACTION_NAMES.REMOVE_ITEM,
            payload: null
        };
    }

    

    private getOrderItemState(state: OrderState, orderItemStateId: number): OrderItemState {
        return state.orderItems.find(ois => ois.id === orderItemStateId);
    }

    private updateItemCount(item: any, magnitude: Number): Action {
        return {
            type: UPDATE_ITEM,
            payload: {
                id: item.id,
                count: item.count + magnitude
            }
        }
    }
}
