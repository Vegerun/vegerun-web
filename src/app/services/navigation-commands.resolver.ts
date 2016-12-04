import { Injectable } from '@angular/core';

import { LocationResult, RestaurantResult } from '../_lib/vegerun/_swagger-gen/v1';

@Injectable()
export class NavigationCommandsResolver {

    resolveSearchNavigationCommands(location: LocationResult): string[] {
        return [
            '/search',
            location.town.slug,
            location.normalizedPostcode
        ];
    }

    resolveOrderNavigationCommands(location: LocationResult, restaurant: RestaurantResult) {
        return [
            ...this.resolveSearchNavigationCommands(location),
            restaurant.slug
        ];
    }
}