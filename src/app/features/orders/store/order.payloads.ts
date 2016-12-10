import { OrderResult } from '../../../_lib/vegerun/_swagger-gen/v1';
import { OrderItemResult, OrderItemCreate, OrderItemUpdate } from '../../../_lib/vegerun/orders';
import { RestaurantResult } from '../../../_lib/vegerun/restaurants';

export interface CreatePayload {
    restaurantId: string;
}

export interface CreateCompletedPayload {
    orderId: string;
}

export interface CreateItemPayload {
    orderItemStateId: number;

    orderItem: OrderItemCreate;

    restaurant: RestaurantResult;
}

export interface CreateItemStartedPayload {
    orderItemStateId: number

    orderItem: OrderItemCreate;
}

export interface CreateItemCompletedPayload {
    orderItemStateId: number;

    orderItem: OrderItemResult;
}

export interface CreateItemFailedPayload {
    orderItemStateId: number;

    error: any
}

export interface CreateItemFromRemovedPayload {
    orderItemStateId: number;
}

export interface UpdateItemPayload {
    orderItemStateId: number;

    orderItem: OrderItemUpdate;
}

export interface UpdateItemStartedPayload {
    orderItemStateId: number

    orderItem: OrderItemUpdate;
}

export interface UpdateItemCompletedPayload {
    orderItemStateId: number;

    orderItem: OrderItemResult;
}

export interface UpdateItemFailedPayload {
    orderItemStateId: number;

    error: any
}

export interface RemoveItemPayload {
    orderItemStateId: number;
}

export interface RemoveItemStartedPayload {
    orderItemStateId: number;
}

export interface RemoveItemCompletedPayload {
    orderItemStateId: number;
}

export interface RemoveItemFailedPayload {
    error: any
}