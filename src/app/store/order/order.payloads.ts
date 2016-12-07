import { OrderResult } from '../../_lib/vegerun/_swagger-gen/v1';
import { CustomerMenuItemResultV2, RestaurantResultV2, OrderItemCreateV2, OrderItemResultV2, OrderItemUpdateV2 } from '../../_lib/vegerun/_swagger-gen/v2';

export interface CreatePayload {
    restaurantId: string;
}

export interface CreateCompletedPayload {
    orderId: string;
}

export interface CreateItemPayload {
    orderItemStateId: number;

    orderItem: OrderItemCreateV2;

    restaurant: RestaurantResultV2;
}

export interface CreateItemPayloadStarted {
    orderItemStateId: number

    orderItem: OrderItemCreateV2;
}

export interface CreateItemCompletedPayload {
    orderItemStateId: number;

    orderItem: OrderItemResultV2;
}

export interface CreateItemFailedPayload {
    orderItemStateId: number;

    error: any
}

export interface UpdateItemPayload {
    orderItemStateId: number;

    orderItem: OrderItemUpdateV2;
}

export interface UpdateItemPayloadStarted {
    orderItemStateId: number

    orderItem: OrderItemUpdateV2;
}

export interface UpdateItemCompletedPayload {
    orderItemStateId: number;

    orderItem: OrderItemResultV2;
}

export interface UpdateItemFailedPayload {
    orderItemStateId: number;

    error: any
}