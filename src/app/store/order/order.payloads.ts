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

export interface UpdateItemPayload {
    orderItem: OrderItemUpdateV2;
    index: number;
}

export interface LoadItemPayload {
    orderItem: OrderItemCreateV2;
    orderId: string;
}

export interface LoadItemCompletedPayload {
    orderItem: OrderItemResultV2;
}