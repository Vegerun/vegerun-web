import { Vegerun2Client, RestaurantResultV2, CustomerMenuResultV2 } from '../../_lib/vegerun/_swagger-gen/v2';

export interface OrderComponentData {
    restaurant: RestaurantResultV2;
    menu: CustomerMenuResultV2
}