import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { RestaurantSearchResult } from '../../_lib/vegerun/_swagger-gen/v1';

@Component({
    selector: 'app-restaurant-result-list',
    templateUrl: './restaurant-result-list.component.html',
    styleUrls: ['./restaurant-result-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RestaurantResultListComponent {
    @Input() results: RestaurantSearchResult[];
    @Output() onResultSelected = new EventEmitter<RestaurantSearchResult>();
}
