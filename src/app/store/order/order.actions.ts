import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { OrderResult } from '../../vegerun-client';
import { CustomerMenuItemResultV2, RestaurantResultV2, OrderItemCreateV2 } from '../../vegerun-2-client';

import { CreatePayload, CreateCompletedPayload, AddItemPayload } from './order.payloads';

const prefix = action => `[Order] ${action}`;
const status = (parentActionName, status) => `${parentActionName} ${status}`;
const completed = actionName => status(actionName, 'COMPLETED');
const failed = actionName => status(actionName, 'FAILED');

const CREATE = prefix('Create');
const CREATE_COMPLETED = completed(CREATE);
const CREATE_FAILED = failed(CREATE);
const ADD_ITEM = prefix('Add Item');
const ADD_ITEM_COMPLETED = completed(ADD_ITEM);
const ADD_ITEM_FAILED = failed(ADD_ITEM);
const REMOVE_ITEM = prefix('Remove Item');
const UPDATE_ITEM_COUNT = prefix('Update Item Count');

export const ORDER_ACTION_NAMES = {
    CREATE,
    CREATE_COMPLETED,
    CREATE_FAILED,

    ADD_ITEM,
    ADD_ITEM_COMPLETED,
    ADD_ITEM_FAILED,
    
    REMOVE_ITEM,
    UPDATE_ITEM_COUNT
};

@Injectable()
export class OrderActions {

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

    addItem(item: CustomerMenuItemResultV2, restaurant: RestaurantResultV2): Action {
        return {
            type: ORDER_ACTION_NAMES.ADD_ITEM,
            payload: <AddItemPayload>{
                orderItem: {
                    orderId: null,
                    itemId: item.id,
                    options: [],
                    excludedOptions: [],
                    instructions: 'Make it vegan ya?',
                    count: 1
                },
                restaurant
            }
        };
    }

    addItemCompleted(item: CustomerMenuItemResultV2, orderItem: any /* OrderItem */): Action {
        return {
            type: ADD_ITEM_COMPLETED,
            payload: {
                item,
                assignedId: orderItem.id
            }
        };
    } 

    addItemFailed(item: CustomerMenuItemResultV2, error: any): Action {
        return {
            type: ADD_ITEM_FAILED,
            payload: {
                item,
                error
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

    private updateItemCount(item: any, magnitude: Number): Action {
        return {
            type: ORDER_ACTION_NAMES.UPDATE_ITEM_COUNT,
            payload: {
                id: item.id,
                count: item.count + magnitude
            }
        }
    }
}