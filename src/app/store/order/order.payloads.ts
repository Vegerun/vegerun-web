import { OrderResult } from '../../vegerun-client';
import { CustomerMenuItemResultV2, RestaurantResultV2, OrderItemCreateV2 } from '../../vegerun-2-client';

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

export interface LoadItemPayload {
    orderItem: OrderItemCreateV2;
    orderId: string;
}