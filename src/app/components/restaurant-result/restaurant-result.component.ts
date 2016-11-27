import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { RestaurantSearchItemResult } from '../../vegerun-client';

@Component({
    selector: 'app-restaurant-result',
    templateUrl: './restaurant-result.component.html',
    styleUrls: ['./restaurant-result.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantResult {
    @Input() result: RestaurantSearchItemResult;

    get categories(): string {
        return this.result.restaurant.categories
            .map(c => c.name)
            .join(', ');
    }
}
