import { OrderItemResultV2, OrderItemCreateV2, OrderItemUpdateV2 } from '../../vegerun-2-client';

export enum OrderItemAdditionStatus {
    Added = 0,

    Loading = 1,

    Loaded = 2,
}

export enum OrderItemDeletionStatus {
    None = 0,

    MarkedForDeletion = 1
}

export interface OrderItemState {
    additionStatus: OrderItemAdditionStatus;

    deletionStatus: OrderItemDeletionStatus;

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