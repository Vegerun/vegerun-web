import { ActionReducer, Action } from '@ngrx/store';

import { OrderItemResultV2 } from '../../vegerun-2-client';

import { RestOperation } from '../../rest-operation';
import { OrderState, OrderItemState, OrderItemPersistence, DEFAULT_ORDER_STATE } from './order.state';
import { ORDER_ACTION_NAMES } from './order.actions';
import { CreatePayload, CreateCompletedPayload, AddItemPayload, LoadItemPayload } from './order.payloads';

export const orderReducer: ActionReducer<OrderState> = (state: OrderState = DEFAULT_ORDER_STATE, { type, payload }: Action) => {
    switch (type) {

        case ORDER_ACTION_NAMES.CREATE: {
            return Object.assign({}, state, {
                orderIdLoading: true,
                restaurantId: (<CreatePayload>payload).restaurantId
             });
        }

        case ORDER_ACTION_NAMES.CREATE_COMPLETED: {
            return Object.assign({}, state, {
                orderId: (<CreateCompletedPayload>payload).orderId,
                orderIdLoading: false
            });
        }

        case ORDER_ACTION_NAMES.CREATE_FAILED: {
            return Object.assign({}, DEFAULT_ORDER_STATE);
        }

        case ORDER_ACTION_NAMES.ADD_ITEM: {
            let { orderItem } = <AddItemPayload>payload;
            let { itemId } = orderItem;
            let existingItem = getItemById(state, orderItem.itemId);
            if (existingItem) {
                return updateItemCount(state, itemId, existingItem.count + 1);
            } else {
                return Object.assign({}, state, {
                    orderItems: [...state.orderItems, <OrderItemState>{
                        data: orderItem,
                        status: OrderItemPersistence.PreLoading
                    }]
                });
            }
        }

        case ORDER_ACTION_NAMES.LOAD_ITEM: {
            let { orderItem } = <LoadItemPayload>payload;
            let { orderId } = state;
            return Object.assign({}, state, {
                orderItems: state.orderItems.map(ois => {
                    if (ois.data === orderItem) {
                        return <OrderItemState>{
                            data: Object.assign({}, ois.data, {
                                orderId
                            }),
                            status: OrderItemPersistence.Loading
                        };
                    } else {
                        return ois;
                    }
                })
            })
            
        }
            
        case ORDER_ACTION_NAMES.LOAD_ITEM_COMPLETED: {
            let { item, assignedId } = payload;
            let existingItem = getItemByObjectReference(state, item);
            if (existingItem) {
                return Object.assign({}, state, {
                    orderItems: state.orderItems.map(existingItem => {
                        if (item === existingItem) {
                            return Object.assign({}, existingItem, { id: assignedId })
                        } else {
                            return existingItem;
                        }
                    })
                });
            } else { // Item has been removed
                return state;
            }
        }
            
        case ORDER_ACTION_NAMES.LOAD_ITEM_FAILED: {
            let { item, err } = payload;
            let existingItem = getItemByObjectReference(state, item);
            if (existingItem) {
                return {
                    orderId: state.orderId,
                    orderIdLoading: false,
                    restaurantId: state.restaurantId,
                    orderItems: state.orderItems.filter(i => existingItem !== item)
                };
            } else { // Item has been removed
                return state;
            }
        }

        // case ORDER_ACTION_NAMES.REMOVE_ITEM:
        //     return {
        //         orderId: state.orderId,
        //         orderIdLoading: false,
        //         restaurantId: state.restaurantId,
        //         orderItems: state.orderItems.filter(i => i.id !== payload)
        //     };

        // case ORDER_ACTION_NAMES.UPDATE_ITEM_COUNT:
        //     return updateItemCount(state, payload.id, payload.count);

        default:
            return state;
    }
}

function getItemById(state: OrderState, itemId: string): any {
    return state.orderItems.filter(i => i.data.itemId === itemId)[0];
}

function getItemByObjectReference(state: OrderState, item: any): any {
    return state.orderItems.filter(i => i === item)[0];
}

function updateItemCount(state: OrderState, itemId: string, count: Number): OrderState {
    return Object.assign({}, state, {
        orderItems: state.orderItems
            .filter(item => (<any>item.data).id) // Select only OrderItemResultV2
            .map(item => {
                let { data } = item;
                if ((<OrderItemResultV2>data).id === itemId) {
                    return Object.assign({}, item, { count });
                } else {
                    return item;
                }
            })
    });
}