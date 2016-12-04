import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { OrderItemFactory, OrderItemComparer } from '../../_lib/vegerun/orders';
import { OrderResult } from '../../_lib/vegerun/_swagger-gen/v1';
import { CustomerMenuItemResultV2, RestaurantResultV2, OrderItemCreateV2 , OrderItemResultV2, OrderItemUpdateV2 } from '../../_lib/vegerun/_swagger-gen/v2';

import { OrderState, OrderItemState } from './order.state';

import {
    CreatePayload, CreateCompletedPayload,
    AddItemPayload, UpdateItemPayload, LoadItemPayload, LoadItemCompletedPayload
} from './order.payloads';

const prefix = action => `[Order] ${action}`;
const status = (parentActionName, status) => `${parentActionName} - ${status}`;
const completed = actionName => status(actionName, 'Completed');
const failed = actionName => status(actionName, 'Failed');

const CREATE = prefix('Create');
const CREATE_COMPLETED = completed(CREATE);
const CREATE_FAILED = failed(CREATE);
const ADD_ITEM = prefix('Add Item');
const UPDATE_ITEM = prefix('Update Item');
const LOAD_ITEM = prefix('Load Item');
const LOAD_ITEM_COMPLETED = completed(LOAD_ITEM);
const LOAD_ITEM_FAILED = failed(LOAD_ITEM);
const REMOVE_ITEM = prefix('Remove Item');


const UPDATE_ITEM_COUNT = prefix('Update Item Count');

export const ORDER_ACTION_NAMES = {
    CREATE,
    CREATE_COMPLETED,
    CREATE_FAILED,

    ADD_ITEM,
    UPDATE_ITEM,
    LOAD_ITEM,
    LOAD_ITEM_COMPLETED,
    LOAD_ITEM_FAILED,
    
    REMOVE_ITEM,
    UPDATE_ITEM_COUNT
};

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

    addItem(state: OrderState, item: CustomerMenuItemResultV2, restaurant: RestaurantResultV2): Action {
        let orderItem = this.orderItemFactory.createOrderItem(item);
        let orderItemStateMatch = this.findOrderItemState(state, orderItem);
        if (orderItemStateMatch) {
            return this._updateItem(orderItemStateMatch, <OrderItemUpdateV2>{
                count: orderItemStateMatch.orderItemState.data.count + 1
            });
        } else {
            return {
                type: ORDER_ACTION_NAMES.ADD_ITEM,
                payload: <AddItemPayload>{
                    orderItem: orderItem,
                    restaurant
                }
            };
        }
    }

    loadItem(orderItem: OrderItemCreateV2, orderId: string): Action {
        return {
            type: LOAD_ITEM,
            payload: <LoadItemPayload>{
                orderItem,
                orderId
            }
        }
    }

    loadItemCompleted(orderItem: OrderItemResultV2): Action {
        return {
            type: LOAD_ITEM_COMPLETED,
            payload: <LoadItemCompletedPayload>{
                orderItem
            }
        };
    }

    loadItemFailed(error: any, orderItem: OrderItemCreateV2): Action {
        return {
            type: LOAD_ITEM_FAILED,
            payload: {
                orderItem,
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

    private findOrderItemState(state: OrderState, orderItem: OrderItemCreateV2 | OrderItemResultV2): OrderItemStateMatch {
        let index = state.orderItems.findIndex(ois => this.orderItemComparer.areEqual(ois.data, orderItem));
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

    private _updateItem(orderItemStateMatch: OrderItemStateMatch, update: any): Action {
        return {
            type: UPDATE_ITEM,
            payload: <UpdateItemPayload>{
                orderItem: Object.assign({}, orderItemStateMatch.orderItemState.data, update),
                index: orderItemStateMatch.index
            }
        };
    }
}

interface OrderItemStateMatch {
    index: number;

    orderItemState: OrderItemState;
}