import { OrderItemResultV2, OrderItemCreateV2, OrderItemUpdateV2 } from '../../_lib/vegerun/_swagger-gen/v2';

export interface OrderItemState {
    local: OrderItemCreateV2 | OrderItemResultV2;

    server: OrderItemResultV2;

    loading: boolean;

    blockedOnOrder: boolean;
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