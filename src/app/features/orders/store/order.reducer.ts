import { ActionReducer, Action } from '@ngrx/store';

import { OrderItemResult, OrderItemCreate } from '../../../_lib/vegerun/orders';

import '../../../../extensions/array.extensions';

import { OrderState, OrderItemState, DEFAULT_ORDER_STATE } from './order.state';
import { ORDER_ACTION_NAMES } from './order.actions';

import {
    CreatePayload, CreateCompletedPayload,
    CreateItemPayload, CreateItemStartedPayload, CreateItemCompletedPayload, CreateItemFailedPayload, CreateItemFromRemovedPayload,
    UpdateItemPayload, UpdateItemStartedPayload, UpdateItemCompletedPayload, UpdateItemFailedPayload,
    RemoveItemPayload, RemoveItemStartedPayload, RemoveItemCompletedPayload
} from './order.payloads';

export const orderReducer: ActionReducer<OrderState> = (state: OrderState = DEFAULT_ORDER_STATE, { type, payload }: Action) => {
    switch (type) {

        case ORDER_ACTION_NAMES.CREATE: {
            let { restaurantId } = <CreatePayload>payload; 
            return Object.assign({}, state, <OrderState>{
                loading: true,
                restaurantId
             });
        }

        case ORDER_ACTION_NAMES.CREATE_COMPLETED: {
            let { orderId } = <CreateCompletedPayload>payload; 
            return Object.assign({}, state, <OrderState>{
                orderId,
                loading: false
            });
        }

        case ORDER_ACTION_NAMES.CREATE_FAILED: {
            return Object.assign({}, DEFAULT_ORDER_STATE);
        }

        case ORDER_ACTION_NAMES.CLEAR: {
            return DEFAULT_ORDER_STATE;
        }

        case ORDER_ACTION_NAMES.CREATE_ITEM: {
            let { orderItem, orderItemStateId } = <CreateItemPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: [...state.orderItems, <OrderItemState>{
                    id: orderItemStateId,
                    local: orderItem
                }]
            });
        }

        case ORDER_ACTION_NAMES.CREATE_ITEM_FROM_REMOVED: {
            let { orderItemStateId } = <CreateItemFromRemovedPayload>payload;
            let orderItemState = state.removedOrderItems.filter(ois => ois.id === orderItemStateId)[0];
            orderItemState.local.count = 1;
            return Object.assign({}, state, <OrderState>{
                orderItems: [...state.orderItems, orderItemState],
                removedOrderItems: state.removedOrderItems.filter(ois => ois !== orderItemState)
            });
        }

        case ORDER_ACTION_NAMES.UPDATE_ITEM: {
            let { orderItemStateId, orderItem } = <UpdateItemPayload>payload;
            return mapItemState(state, orderItemStateId, ois => Object.assign({}, ois, <OrderItemState>{
                local: Object.assign({}, ois.local, orderItem)
            }));
        }

        case ORDER_ACTION_NAMES.REMOVE_ITEM: {
            let { orderItemStateId } = <RemoveItemPayload>payload;
            let orderItemState = findOrderItemState(state.orderItems, orderItemStateId);
            
            let newState = Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.filter(ois => ois !== orderItemState)
            });

            if (!newState.loading) {
                // We need to hold a reference to this item, as it may exist on server.
                newState.removedOrderItems = [...state.removedOrderItems, orderItemState]
            }

            return newState;
        }

        case ORDER_ACTION_NAMES.CREATE_ITEM_STARTED:
        case ORDER_ACTION_NAMES.UPDATE_ITEM_STARTED: {
            let { orderItemStateId } = <CreateItemStartedPayload | UpdateItemStartedPayload>payload;
            return startItemServerOperation(state, orderItemStateId);
        }
        
        case ORDER_ACTION_NAMES.REMOVE_ITEM_STARTED: {
            let { orderItemStateId } = <RemoveItemStartedPayload>payload;
            return Object.assign({}, state, <OrderState>{
                removedOrderItems: state.removedOrderItems.filterMap(
                    (ois: OrderItemState) => ois.id === orderItemStateId,
                    (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
                        loading: true
                    }))
            });
        }

        case ORDER_ACTION_NAMES.CREATE_ITEM_COMPLETED:
        case ORDER_ACTION_NAMES.UPDATE_ITEM_COMPLETED: {
            let { orderItemStateId, orderItem } = <CreateItemCompletedPayload | UpdateItemCompletedPayload>payload;
            return completeItemServerOperation(state, orderItemStateId, orderItem);
        }

        case ORDER_ACTION_NAMES.REMOVE_ITEM_COMPLETED: {
            let { orderItemStateId } = <RemoveItemCompletedPayload>payload;
            let removedOrderItemState = findOrderItemState(state.removedOrderItems, orderItemStateId);
            if (removedOrderItemState) {
                return Object.assign({}, state, <OrderState>{
                    removedOrderItems: state.removedOrderItems.filter(ois => ois !== removedOrderItemState)
                });
            } else {
                // The item has been recreated since delete started.
                return mergeIntoItemState(state, orderItemStateId, <OrderItemState>{
                    loading: false,
                    server: null
                });
            }
        }

        case ORDER_ACTION_NAMES.CREATE_ITEM_FAILED: 
        case ORDER_ACTION_NAMES.UPDATE_ITEM_FAILED: {
            let { orderItemStateId } = <CreateItemFailedPayload | UpdateItemFailedPayload>payload;
            return failItemServerOperation(state, payload.orderItemStateId);
        }

        default:
            return state;
    }
}

function updateOrderItems(state: OrderState, updateFn: (currentOrderItems: OrderItemState[]) => OrderItemState[]): OrderState {
    return Object.assign({}, state, <OrderState>{
        orderItems: updateFn(state.orderItems)
    });
}

function mapItemState(state: OrderState, orderItemStateId: number, mapFunc: (ois: OrderItemState) => OrderItemState): OrderState {
    return updateOrderItems(state, currentOrderItems => currentOrderItems.filterMap(
        (ois: OrderItemState) => ois.id === orderItemStateId,
        (ois: OrderItemState) => mapFunc(ois)));
}

function mergeIntoItemState(state: OrderState, orderItemStateId: number, toMerge: any): OrderState {
    return mapItemState(state, orderItemStateId, ois => Object.assign({}, ois, toMerge));
}

function startItemServerOperation(state: OrderState, orderItemStateId: number): OrderState {
    return mergeIntoItemState(state, orderItemStateId, <OrderItemState>{
        loading: true
    });
}

function completeItemServerOperation(state: OrderState, orderItemStateId: number, orderItem: OrderItemResult): OrderState {
    return mergeIntoItemState(state, orderItemStateId, <OrderItemState>{
        loading: false,
        server: orderItem
    });
}

function failItemServerOperation(state: OrderState, orderItemStateId: number): OrderState {
    return mergeIntoItemState(state, orderItemStateId, <OrderItemState>{
        loading: false
    });
}

function findOrderItemState(array: OrderItemState[], orderItemStateId: number) {
    return array.filter(ois => ois.id === orderItemStateId)[0];
}