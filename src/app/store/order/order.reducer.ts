import { ActionReducer, Action } from '@ngrx/store';

import { OrderItemResultV2, OrderItemCreateV2 } from '../../_lib/vegerun/_swagger-gen/v2';
import { OrderItemComparer, OrderItem } from '../../_lib/vegerun/orders';

import '../../../extensions/array.extensions';

import { OrderState, OrderItemState, DEFAULT_ORDER_STATE } from './order.state';
import { ORDER_ACTION_NAMES } from './order.actions';

import {
    CreatePayload, CreateCompletedPayload,
    AddItemPayload, ItemBlockedOnOrderPayload, UnblockItemPayload, UpdateItemPayload, LoadItemPayload, LoadItemCompletedPayload
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

        case ORDER_ACTION_NAMES.ADD_ITEM: {
            let { orderItem } = <AddItemPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: [...state.orderItems, <OrderItemState>{
                    local: orderItem,
                    // server: null,
                    // loading: false,              // TODO: IMPLIED?
                    // blockedOnOrder: false
                }]
            });
        }

        case ORDER_ACTION_NAMES.BLOCK_ITEM_ON_ORDER: {
            let { index } = <ItemBlockedOnOrderPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.filterMap(
                    (v, i) => i === index,
                    ois => Object.assign({}, ois, <OrderItemState>{
                        blockedOnOrder: true
                    })
                )
            });
        }

        case ORDER_ACTION_NAMES.UNBLOCK_ITEM: {
            let { index } = <UnblockItemPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.mapAtIndex(
                    index,
                    (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
                        blockedOnOrder: false
                    }))
            });
        }

        case ORDER_ACTION_NAMES.LOAD_ITEM: {
            let { index, orderItem } = <LoadItemPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.mapMergeAtIndex(index, <OrderItemState>{
                    loading: true,
                    server: orderItem
                })
            });
        }

        case ORDER_ACTION_NAMES.LOAD_ITEM_COMPLETED: {
            let { orderItem, index } = <LoadItemCompletedPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.mapAtIndex(
                    index,
                    (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
                        loading: false,
                        server: orderItem
                    }))
            });
        }

        case ORDER_ACTION_NAMES.UPDATE_ITEM: {
            let { orderItem, index } = <UpdateItemPayload>payload;

            debugger;
        }

        
            
        
            
        case ORDER_ACTION_NAMES.LOAD_ITEM_FAILED: {
            let { item, err } = payload;
            //let existingItem = getItemByObjectReference(state, item);
            // if (existingItem) {
            //     return {
            //         orderId: state.orderId,
            //         orderIdLoading: false,
            //         restaurantId: state.restaurantId,
            //         orderItems: state.orderItems.filter(i => existingItem !== item)
            //     };
            // } else { // Item has been removed
            //     return state;
            // }
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