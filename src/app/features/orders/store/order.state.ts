import { OrderItemResult, OrderItemCreate, OrderItemUpdate } from '../../../_lib/vegerun/orders';

export interface OrderItemState {
    id: number,

    local: OrderItemCreate;

    server: OrderItemResult;

    loading: boolean;

    blocked: boolean;
}

export interface OrderState {
    orderId: string;

    orderIdLoading: boolean;

    restaurantId: string;

    orderItems: OrderItemState[];
}

export const DEFAULT_ORDER_STATE: OrderState = {
    orderId: null,

    orderIdLoading: false,

    restaurantId: null,

    orderItems: []
}