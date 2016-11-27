import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { RestaurantSearchResult } from '../../vegerun-client';

@Component({
    selector: 'app-restaurant-result-list',
    templateUrl: './restaurant-result-list.component.html',
    styleUrls: ['./restaurant-result-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantResultList {
    @Input() restaurants: RestaurantSearchResult[];
    @Output() onRestaurantSelected = new EventEmitter<RestaurantSearchResult>();
}
