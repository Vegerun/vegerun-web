import { ActionReducer, Action } from '@ngrx/store';

import { OrderItemResultV2, OrderItemCreateV2 } from '../../_lib/vegerun/_swagger-gen/v2';
import { OrderItemComparer, OrderItem } from '../../_lib/vegerun/orders';

import '../../../extensions/array.extensions';

import { OrderState, OrderItemState, OrderItemAdditionStatus, OrderItemDeletionStatus, DEFAULT_ORDER_STATE } from './order.state';
import { ORDER_ACTION_NAMES } from './order.actions';

import {
    CreatePayload, CreateCompletedPayload,
    AddItemPayload, LoadItemPayload, LoadItemCompletedPayload
} from './order.payloads';

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
            let orderItemStateMatch = findOrderItemState(state, orderItem);
            if (orderItemStateMatch) {
                return updateItemCount(state, orderItemStateMatch, orderItemStateMatch.orderItemState.data.count + 1)
            } else {
                return addItem(state, orderItem);
            }
        }

        case ORDER_ACTION_NAMES.LOAD_ITEM: {
            let { orderItem } = <LoadItemPayload>payload;
            let { orderId } = state;
            return Object.assign({}, state, {
                orderItems: state.orderItems.filterMap(
                    ois => OrderItemComparer.areEqual(ois.data, orderItem),
                    ois => Object.assign({}, ois, <OrderItemState>{
                        data: orderItem,
                        additionStatus: OrderItemAdditionStatus.Loading
                    })
                )
            });
        }
            
        case ORDER_ACTION_NAMES.LOAD_ITEM_COMPLETED: {
            let { orderItem } = <LoadItemCompletedPayload>payload;
            return Object.assign({}, state, {
                orderItems: state.orderItems.filterMap(
                    ois => OrderItemComparer.areEqual(ois.data, orderItem),
                    ois => Object.assign({}, ois, <OrderItemState>{
                        data: orderItem,
                        additionStatus: OrderItemAdditionStatus.Loaded
                    })
                )
            });
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

function addItem(state: OrderState, orderItemCreate: OrderItemCreateV2): OrderState {
    return Object.assign({}, state, <OrderState>{
        orderItems: [...state.orderItems, <OrderItemState>{
            data: orderItemCreate,
            additionStatus: OrderItemAdditionStatus.Added,
            deletionStatus: OrderItemDeletionStatus.None
        }]
    });
}

function updateItemCount(state: OrderState, orderItemStateMatch: OrderItemStateMatch, newCount: number): OrderState {
    return Object.assign({}, state, <OrderState>{
        orderItems: state.orderItems.filterMap(
            (orderItemState, index) => index === orderItemStateMatch.index,
            orderItemState => Object.assign({}, orderItemState, <OrderItemState>{
                data: Object.assign({}, orderItemState.data, <OrderItem>{
                    count: newCount
                })
            })
        )
    });
}

interface OrderItemStateMatch {
    index: number;

    orderItemState: OrderItemState;
}

function findOrderItemState(state: OrderState, orderItem: OrderItemCreateV2 | OrderItemResultV2): OrderItemStateMatch {
    let index = state.orderItems.findIndex(ois => OrderItemComparer.areEqual(ois.data, orderItem));
    if (index > 0) {
        return {
            index,
            orderItemState: state.orderItems[index]
        }
    } else {
        return null;
    }
}
