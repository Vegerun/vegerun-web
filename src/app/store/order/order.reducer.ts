import { ActionReducer, Action } from '@ngrx/store';

import { OrderItemResultV2, OrderItemCreateV2 } from '../../_lib/vegerun/_swagger-gen/v2';
import { OrderItemComparer, OrderItem } from '../../_lib/vegerun/orders';

import '../../../extensions/array.extensions';

import { OrderState, OrderItemState, DEFAULT_ORDER_STATE } from './order.state';
import { ORDER_ACTION_NAMES } from './order.actions';

import {
    CreatePayload, CreateCompletedPayload,
    CreateItemPayload, SyncCreateItemPayload, SyncCreateItemCompletedPayload, SyncCreateItemFailedPayload,
    UpdateItemPayload
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

        case ORDER_ACTION_NAMES.SYNC_CREATE_ITEM: {
            let { orderItemStateId } = <SyncCreateItemPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.filterMap(
                    (ois: OrderItemState) => ois.id === orderItemStateId,
                    (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
                        loading: true
                    }))
            });
        }

        case ORDER_ACTION_NAMES.SYNC_CREATE_ITEM_COMPLETED: {
            let { orderItemStateId, orderItem } = <SyncCreateItemCompletedPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.filterMap(
                    (ois: OrderItemState) => ois.id === orderItemStateId,
                    (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
                        loading: false,
                        server: orderItem
                    }))
            });
        }

        case ORDER_ACTION_NAMES.SYNC_CREATE_ITEM_FAILED: {
            let { orderItemStateId } = <SyncCreateItemFailedPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.filterMap(
                    (ois: OrderItemState) => ois.id === orderItemStateId,
                    (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
                        loading: false
                    }))
            });
        }

        case ORDER_ACTION_NAMES.UPDATE_ITEM: {
            let { orderItemStateId, orderItem } = <UpdateItemPayload>payload;
            return Object.assign({}, state, <OrderState>{
                orderItems: state.orderItems.filterMap(
                    (ois: OrderItemState) => ois.id === orderItemStateId,
                    (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
                        local: orderItem
                    }))
            });
        }

        // case ORDER_ACTION_NAMES.BLOCK_ITEM_ON_ORDER: {
        //     let { index } = <ItemBlockedOnOrderPayload>payload;
        //     return Object.assign({}, state, <OrderState>{
        //         orderItems: state.orderItems.filterMap(
        //             (v, i) => i === index,
        //             ois => Object.assign({}, ois, <OrderItemState>{
        //                 blocked: true
        //             })
        //         )
        //     });
        // }

        // case ORDER_ACTION_NAMES.UNBLOCK_ITEM: {
        //     let { index } = <UnblockItemPayload>payload;
        //     return Object.assign({}, state, <OrderState>{
        //         orderItems: state.orderItems.mapAtIndex(
        //             index,
        //             (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
        //                 blocked: false
        //             }))
        //     });
        // }


        // case ORDER_ACTION_NAMES.LOAD_ITEM_COMPLETED: {
        //     let { orderItem, index } = <SyncCreateItemCompletedPayload>payload;
        //     return Object.assign({}, state, <OrderState>{
        //         orderItems: state.orderItems.mapAtIndex(
        //             index,
        //             (ois: OrderItemState) => Object.assign({}, ois, <OrderItemState>{
        //                 loading: false,
        //                 server: orderItem
        //             }))
        //     });
        // }

        // TODO: Handle error specifically (handled generally later) - retry request etc?
        // case ORDER_ACTION_NAMES.LOAD_ITEM_FAILED: {
        //     return state;
        // }

        

        // case ORDER_ACTION_NAMES.REMOVE_ITEM:
        //     return {
        //         orderId: state.orderId,
        //         orderIdLoading: false,
        //         restaurantId: state.restaurantId,
        //         orderItems: state.orderItems.filter(i => i.id !== payload)
        //     };

        // TODO: Just use update reducer
        // case ORDER_ACTION_NAMES.UPDATE_ITEM_COUNT:
        //     return updateItemCount(state, payload.id, payload.count);

        default:
            return state;
    }
}