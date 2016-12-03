import { Vegerun2Client, RestaurantResultV2, CustomerMenuResultV2 } from '../../vegerun-2-client';

export interface OrderComponentData {
    restaurant: RestaurantResultV2;
    menu: CustomerMenuResultV2
}