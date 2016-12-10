import { ActionReducer, Action } from '@ngrx/store';

import { OrderItemResult, OrderItemCreate } from '../../../_lib/vegerun/orders';

import '../../../../extensions/array.extensions';

import { OrderState, OrderItemState, DEFAULT_ORDER_STATE } from './order.state';
import { ORDER_ACTION_NAMES } from './order.actions';

import {
    CreatePayload, CreateCompletedPayload,
    CreateItemPayload, CreateItemPayloadStarted, CreateItemCompletedPayload, CreateItemFailedPayload,
    UpdateItemPayload, UpdateItemPayloadStarted, UpdateItemCompletedPayload, UpdateItemFailedPayload,
} from './order.payloads';

export const orderReducer: ActionReducer<OrderState> = (state: OrderState = DEFAULT_ORDER_STATE, { type, payload }: Action) => {
    switch (type) {

        case ORDER_ACTION_NAMES.CREATE: {
            let { restaurantId } = <CreatePayload>payload; 
            return Object.assign({}, state, {
                orderIdLoading: true,
                restaurantId
             });
        }

        case ORDER_ACTION_NAMES.CREATE_COMPLETED: {
            let { orderId } = <CreateCompletedPayload>payload; 
            return Object.assign({}, state, {
                orderId,
                orderIdLoading: false
            });
        }

        case ORDER_ACTION_NAMES.CREATE_FAILED: {
            return Object.assign({}, DEFAULT_ORDER_STATE);
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

        case ORDER_ACTION_NAMES.UPDATE_ITEM: {
            let { orderItemStateId, orderItem } = <UpdateItemPayload>payload;
            return mapItemState(state, orderItemStateId, ois => Object.assign({}, ois, <OrderItemState>{
                local: Object.assign({}, ois.local, orderItem)
            }));
        }
        
        case ORDER_ACTION_NAMES.CREATE_ITEM_STARTED:
        case ORDER_ACTION_NAMES.UPDATE_ITEM_STARTED: {
            let { orderItemStateId } = <CreateItemPayloadStarted | UpdateItemPayloadStarted>payload;
            return startItemServerOperation(state, orderItemStateId);
        }

        case ORDER_ACTION_NAMES.CREATE_ITEM_COMPLETED:
        case ORDER_ACTION_NAMES.UPDATE_ITEM_COMPLETED: {
            let { orderItemStateId, orderItem } = <CreateItemCompletedPayload | UpdateItemCompletedPayload>payload;
            return completeItemServerOperation(state, orderItemStateId, orderItem);
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

function mapItemState(state: OrderState, orderItemStateId: number, mapFunc: (ois: OrderItemState) => OrderItemState): OrderState {
    return Object.assign({}, state, <OrderState>{
        orderItems: state.orderItems.filterMap(
            (ois: OrderItemState) => ois.id === orderItemStateId,
            (ois: OrderItemState) => mapFunc(ois))
    });
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