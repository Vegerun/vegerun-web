import { OrderItemResultV2, OrderItemCreateV2, OrderItemUpdateV2 } from '../../vegerun-2-client';

export enum OrderItemPersistence {
    PreLoading = 0,

    Loading = 1,

    Persisted = 2
}

export interface OrderItemState {
    status: OrderItemPersistence;

    data: OrderItemCreateV2 | OrderItemResultV2;
}

export interface OrderState {
    orderId: string,

    orderIdLoading: boolean,

    restaurantId: string,

    orderItems: OrderItemState[]
}

export const DEFAULT_ORDER_STATE: OrderState = {
    orderId: null,

    orderIdLoading: false,

    restaurantId: null,

    orderItems: []
}