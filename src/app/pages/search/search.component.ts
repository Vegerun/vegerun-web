import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { VegerunClient, LocationResult, RestaurantSearchResult, RestaurantResult } from '../../vegerun-client';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    private location$: Observable<LocationResult>;
    private restaurantSearchResult$: Observable<RestaurantSearchResult>;
    private restaurantsInRange$: Observable<RestaurantResult[]>;
    
    constructor(
        private route: ActivatedRoute,
        private vegerunClient: VegerunClient
    ) { }

    ngOnInit() {
        this.location$ = this.route.data.map((data: { location: LocationResult }) => data.location);

        this.restaurantSearchResult$ = this.location$
            .flatMap(location => this.vegerunClient.apiV1RestaurantsSearchSearchPost({
                latitude: location.position.latitude,
                longitude: location.position.longitude,
                townId: location.town.id,
                postcode: location.normalizedPostcode
            }));
        
        this.restaurantsInRange$ = this.restaurantSearchResult$
            .map(result => [
                ...result.availableRestaurants,
                ...result.unavailableRestaurants,
                ...result.comingSoonRestaurants
            ]);
    }
}
