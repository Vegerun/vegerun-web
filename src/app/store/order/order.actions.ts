import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { OrderItemFactory, OrderItemComparer } from '../../_lib/vegerun/orders';
import { OrderResult } from '../../_lib/vegerun/_swagger-gen/v1';
import { CustomerMenuItemResultV2, RestaurantResultV2, OrderItemCreateV2 , OrderItemResultV2, OrderItemUpdateV2 } from '../../_lib/vegerun/_swagger-gen/v2';

import { OrderState, OrderItemState } from './order.state';

import {
    CreatePayload, CreateCompletedPayload,
    AddItemPayload, ItemBlockedOnOrderPayload, UpdateItemPayload, LoadItemPayload, LoadItemCompletedPayload
} from './order.payloads';

const prefix = action => `[Order] ${action}`;
const status = (parentActionName, status) => `${parentActionName} - ${status}`;
const completed = actionName => status(actionName, 'Completed');
const failed = actionName => status(actionName, 'Failed');

const CREATE = prefix('Create');
const CREATE_COMPLETED = completed(CREATE);
const CREATE_FAILED = failed(CREATE);
const ADD_ITEM = prefix('Add Item');
const BLOCK_ITEM_ON_ORDER = prefix('Item Blocked On Order');
const UNBLOCK_ITEM = prefix('Item Unblocked');
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
    BLOCK_ITEM_ON_ORDER,
    UNBLOCK_ITEM,

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
            let { local } = orderItemStateMatch.orderItemState;
            debugger;
            return {
                type: UPDATE_ITEM,
                payload: <UpdateItemPayload>{
                    orderItem: Object.assign({}, local, <OrderItemCreateV2>{
                        count: local.count + 1
                    }),
                    index: orderItemStateMatch.index
                }
            };
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

    blockItemOnOrder(state: OrderState, orderItem: OrderItemCreateV2): Action {
        let orderItemStateMatch = this.findOrderItemState(state, orderItem);
        return {
            type: BLOCK_ITEM_ON_ORDER,
            payload: <ItemBlockedOnOrderPayload>{
                index: orderItemStateMatch.index
            }
        };
    }

    unblockItems(state: OrderState): Action[] {
        return state.orderItems
            .map((orderItemState, index) => ({
                orderItemState,
                index
            }))
            .filter(a => a.orderItemState.blockedOnOrder)
            .map(a => ({
                type: UNBLOCK_ITEM,
                payload: {
                    orderId: state.orderId,
                    orderItem: a.orderItemState.local,
                    index: a.index
                }
            }));
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

    loadItemCompleted(state: OrderState, orderItem: OrderItemResultV2): Action {
        let { index } = this.findOrderItemState(state, orderItem);
        return {
            type: LOAD_ITEM_COMPLETED,
            payload: <LoadItemCompletedPayload>{
                orderItem,
                index
            }
        };
    }

    loadItemFailed(error: any, orderItem: OrderItemCreateV2): Action {
        debugger;
        return {
            type: LOAD_ITEM_FAILED,
            payload: {
                orderItem,
                error
            }
        };
    }

    updateItem(orderItemState: OrderItemState): Action {
        return {
            type: UPDATE_ITEM
        }
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

    private _updateItem(orderItemStateMatch: OrderItemStateMatch, update: any): Action {
        
    }
}

interface OrderItemStateMatch {
    index: number;

    orderItemState: OrderItemState;
}