import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ActionNamesHelper } from '../../../../helpers/action-names.helper';

import { OrderItemFactory, OrderItemComparer, OrderResult, OrderItemResult, OrderItemCreate, OrderItemUpdate } from '../../../_lib/vegerun/orders';
import { CustomerMenuItemResult } from '../../../_lib/vegerun/menus';
import { RestaurantResult } from '../../../_lib/vegerun/restaurants';

import { OrderState, OrderItemState } from './order.state';
import {
    CreatePayload, CreateCompletedPayload,
    CreateItemPayload, CreateItemStartedPayload, CreateItemCompletedPayload, CreateItemFailedPayload, CreateItemFromRemovedPayload,
    UpdateItemPayload, UpdateItemStartedPayload, UpdateItemCompletedPayload, UpdateItemFailedPayload,
    RemoveItemPayload, RemoveItemStartedPayload, RemoveItemCompletedPayload, RemoveItemFailedPayload
} from './order.payloads';

const actionNamesHelper = new ActionNamesHelper('Order');

const CREATE = actionNamesHelper.getName('Create');
const CREATE_COMPLETED = actionNamesHelper.getCompletedName(CREATE);
const CREATE_FAILED = actionNamesHelper.getFailedName(CREATE);

const CREATE_ITEM = actionNamesHelper.getName('Create Item');
const CREATE_ITEM_STARTED = actionNamesHelper.getStartedName(CREATE_ITEM);
const CREATE_ITEM_COMPLETED = actionNamesHelper.getCompletedName(CREATE_ITEM);
const CREATE_ITEM_FAILED = actionNamesHelper.getFailedName(CREATE_ITEM);
const CREATE_ITEM_FROM_REMOVED = actionNamesHelper.getChildName(CREATE_ITEM, 'From Removed');

const CLEAR = actionNamesHelper.getName('Clear');

const UPDATE_ITEM = actionNamesHelper.getName('Update Item');
const UPDATE_ITEM_STARTED = actionNamesHelper.getStartedName(UPDATE_ITEM);
const UPDATE_ITEM_COMPLETED = actionNamesHelper.getCompletedName(UPDATE_ITEM);
const UPDATE_ITEM_FAILED = actionNamesHelper.getFailedName(UPDATE_ITEM);

const REMOVE_ITEM = actionNamesHelper.getName('Remove Item');
const REMOVE_ITEM_STARTED = actionNamesHelper.getStartedName(REMOVE_ITEM);
const REMOVE_ITEM_COMPLETED = actionNamesHelper.getCompletedName(REMOVE_ITEM);
const REMOVE_ITEM_FAILED = actionNamesHelper.getFailedName(REMOVE_ITEM);

export const ORDER_ACTION_NAMES = {
    CREATE,
    CREATE_COMPLETED,
    CREATE_FAILED,

    CLEAR,

    CREATE_ITEM,
    CREATE_ITEM_STARTED,
    CREATE_ITEM_COMPLETED,
    CREATE_ITEM_FAILED,
    CREATE_ITEM_FROM_REMOVED,

    UPDATE_ITEM,
    UPDATE_ITEM_STARTED,
    UPDATE_ITEM_COMPLETED,
    UPDATE_ITEM_FAILED,
    
    REMOVE_ITEM,
    REMOVE_ITEM_STARTED,
    REMOVE_ITEM_COMPLETED,
    REMOVE_ITEM_FAILED
};

let currentOrderItemStateId = 0;

@Injectable()
export class OrderActions {

    constructor(
        private orderItemFactory: OrderItemFactory,
        private orderItemComparer: OrderItemComparer
    ) { }

    create(restaurant: RestaurantResult): Action {
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

    clear(): Action {
        return {
            type: CLEAR
        };
    }

    createItem(state: OrderState, item: CustomerMenuItemResult, restaurant: RestaurantResult): Action {
        let orderItem = this.orderItemFactory.createOrderItem(item);
        const findOrderItemMatch = (orderItems: OrderItemState[]) =>
            orderItems.find(ois => this.orderItemComparer.areContentsEqual(ois.local, orderItem));

        let existingOrderItemState = findOrderItemMatch(state.orderItems);
        if (existingOrderItemState) {
            return this.updateItemCount(existingOrderItemState, 1);
        } else {
            let removedOrderItemState = findOrderItemMatch(state.removedOrderItems);
            if (removedOrderItemState) {
                return {
                    type: CREATE_ITEM_FROM_REMOVED,
                    payload: <CreateItemFromRemovedPayload>{
                        orderItemStateId: removedOrderItemState.id
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
    }

    createItemStarted(state: OrderState, orderItemStateId: number): Action {
        let orderItemState = state.orderItems.find(ois => ois.id === orderItemStateId);
        return {
            type: CREATE_ITEM_STARTED,
            payload: <CreateItemStartedPayload>{
                orderItemStateId,
                orderItem: orderItemState.local,
            }
        };
    }

    createItemCompleted(orderItemStateId: number, orderItem: OrderItemResult): Action {
        return {
            type: CREATE_ITEM_COMPLETED,
            payload: <CreateItemCompletedPayload>{
                orderItemStateId,
                orderItem
            }
        };
    }

    createItemFailed(orderItemStateId: number, error: any, orderItem: OrderItemCreate): Action {
        return {
            type: CREATE_ITEM_FAILED,
            payload: <CreateItemFailedPayload>{
                orderItemStateId,
                orderItem,
                error
            }
        };
    }

    updateItem(state: OrderState, orderItemStateId: number, orderItem: OrderItemUpdate): Action {
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
            payload: <UpdateItemStartedPayload>{
                orderItemStateId,
                orderItem: <OrderItemUpdate>orderItemState.local
            }
        };
    }    

    updateItemCompleted(orderItemStateId: number, orderItem: OrderItemResult): Action {
        return {
            type: UPDATE_ITEM_COMPLETED,
            payload: <UpdateItemCompletedPayload>{
                orderItemStateId,
                orderItem
            }
        };
    }

    updateItemFailed(orderItemStateId: number, error: any, orderItem: OrderItemCreate): Action {
        return {
            type: UPDATE_ITEM_FAILED,
            payload: <UpdateItemFailedPayload>{
                orderItemStateId,
                orderItem,
                error
            }
        };
    }

    removeItem(state: OrderState, orderItemStateId: number): Action {
        return {
            type: ORDER_ACTION_NAMES.REMOVE_ITEM,
            payload: <RemoveItemPayload>{
                orderItemStateId: orderItemStateId
            }
        };
    }

    removeItemStarted(orderItemStateId: number): Action {
        return {
            type: REMOVE_ITEM_STARTED,
            payload: <RemoveItemStartedPayload>{
                orderItemStateId
            }
        };
    }    

    removeItemCompleted(orderItemStateId: number): Action {
        return {
            type: REMOVE_ITEM_COMPLETED,
            payload: <RemoveItemCompletedPayload>{
                orderItemStateId
            }
        };
    }

    removeItemFailed(error: any): Action {
        return {
            type: REMOVE_ITEM_FAILED,
            payload: <RemoveItemFailedPayload>{
                error
            }
        };
    }

    incrementItem(state: OrderState, orderItemStateId: number): Action {
        let orderItemState = this.getOrderItemState(state, orderItemStateId);
        return this.updateItemCount(orderItemState, 1);
    }

    decrementItem(state: OrderState, orderItemStateId: number): Action {
        let orderItemState = this.getOrderItemState(state, orderItemStateId);
        if (orderItemState.local.count === 1) {
            return this.removeItem(state, orderItemStateId);
        } else {
            return this.updateItemCount(orderItemState, -1);
        }
    }

    private getOrderItemState(state: OrderState, orderItemStateId: number): OrderItemState {
        return state.orderItems.find(ois => ois.id === orderItemStateId);
    }

    private updateItemCount(state: OrderItemState, magnitude: number): Action {
        return {
            type: UPDATE_ITEM,
            payload: <UpdateItemPayload>{
                orderItemStateId: state.id,
                orderItem: <OrderItemUpdate>{
                    count: state.local.count + magnitude
                }
            }
        }
    }
}
