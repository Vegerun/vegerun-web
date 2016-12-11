import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, Inject } from '@angular/core';

import { API_BASE_URL, RestaurantSearchItemResult } from '../../_lib/vegerun/_swagger-gen/v1';

@Component({
    selector: 'app-restaurant-result',
    templateUrl: './restaurant-result.component.html',
    styleUrls: ['./restaurant-result.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantResultComponent {
    @Input() result: RestaurantSearchItemResult;

    constructor(@Inject(API_BASE_URL) private baseUrl?: string) { }

    get imageUrl(): string {
        let { searchImageUrl } = this.result.restaurant.images;
        if (searchImageUrl.startsWith('/')) {
            return this.baseUrl + searchImageUrl;
        } else {
            return searchImageUrl;
        }
    }

    get categories(): string {
        return this.result.restaurant.categories
            .map(c => c.name)
            .join(', ');
    }
}
