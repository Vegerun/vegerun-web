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

export interface CreateItemPayloadStarted {
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

export interface UpdateItemPayload {
    orderItemStateId: number;

    orderItem: OrderItemUpdate;
}

export interface UpdateItemPayloadStarted {
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