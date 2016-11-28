import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { VegerunClient, LocationResult, RestaurantSearchResult, RestaurantSearchItemResult } from '../../vegerun-client';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    private location$: Observable<LocationResult>;
    private result$: Observable<RestaurantSearchResult>;
    private resultsInRange$: Observable<RestaurantSearchItemResult[]>;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private vegerunClient: VegerunClient
    ) { }

    ngOnInit() {
        this.location$ = this.route.data.map((data: { location: LocationResult }) => data.location);

        this.result$ = this.location$
            .flatMap(location => this.vegerunClient.apiV1RestaurantsSearchSearchPost({
                latitude: location.position.latitude,
                longitude: location.position.longitude,
                townId: location.town.id,
                postcode: location.normalizedPostcode
            }));
        
        this.resultsInRange$ = this.result$
            .map(result => [
                ...result.availableRestaurants,
                ...result.unavailableRestaurants,
                ...result.comingSoonRestaurants
            ]);
    }

    navigateToRestaurant(restaurantResult: RestaurantSearchItemResult) {
        this.location$.subscribe(location => {
            this.router.navigate([
                '/search',
                location.town.name.toLowerCase(),
                location.normalizedPostcode,
                restaurantResult.restaurant.slug
            ]);
        });
    }
}
