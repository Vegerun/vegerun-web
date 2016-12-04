import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Vegerun2Client } from '../../_lib/vegerun/_swagger-gen/v2';
import { OrderComponentData } from './order.component.data';

@Injectable()
export class OrderComponentResolve implements Resolve<OrderComponentData> {

    constructor(
        private vegerunClient: Vegerun2Client
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<OrderComponentData>|boolean {
        let { townSlug, restaurantSlug } = route.params;
        if (!townSlug || !restaurantSlug) {
            return false;
        }

        return this.vegerunClient.apiV2RestaurantsByTownSlugByRestaurantSlugGet(townSlug, restaurantSlug)
            .flatMap(restaurant => {
                return this.vegerunClient.apiV2MenusByRestaurantIdGet(restaurant.id)
                    .map(menu => ({ restaurant, menu }));
            })
            .toPromise();
    }
}