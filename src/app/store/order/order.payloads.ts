import { OrderResult } from '../../_lib/vegerun/_swagger-gen/v1';
import { CustomerMenuItemResultV2, RestaurantResultV2, OrderItemCreateV2, OrderItemResultV2, OrderItemUpdateV2 } from '../../_lib/vegerun/_swagger-gen/v2';

export interface CreatePayload {
    restaurantId: string;
}

export interface CreateCompletedPayload {
    orderId: string;
}

export interface AddItemPayload {
    orderItem: OrderItemCreateV2;
    restaurant: RestaurantResultV2;
}

export interface ItemBlockedOnOrderPayload {
    index: number
}

export interface UnblockItemPayload {
    orderItem: OrderItemCreateV2,
    index: number
}

export interface LoadItemPayload {
    orderId: string;
    orderItem: OrderItemResultV2;
    index: number
}

export interface UpdateItemPayload {
    orderItem: OrderItemUpdateV2;
    index: number;
}

export interface LoadItemCompletedPayload {
    orderItem: OrderItemResultV2;
    index: number;
}