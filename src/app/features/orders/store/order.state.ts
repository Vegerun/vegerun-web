import { OrderItemResult, OrderItemCreate, OrderItemUpdate } from '../../../_lib/vegerun/orders';

export interface OrderItemState {
    id: number,

    local: OrderItemCreate;

    server: OrderItemResult;

    loading: boolean;
}

export interface OrderState {
    orderId: string;

    loading: boolean;

    restaurantId: string;

    orderItems: OrderItemState[];

    removedOrderItems: OrderItemState[];
}

export const DEFAULT_ORDER_STATE: OrderState = {
    orderId: null,

    loading: false,

    restaurantId: null,

    orderItems: [],

    removedOrderItems: []
}