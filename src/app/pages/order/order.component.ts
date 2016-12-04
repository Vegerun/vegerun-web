import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { RestaurantResultV2, CustomerMenuResultV2, CustomerMenuItemResultV2 } from '../../_lib/vegerun/_swagger-gen/v2';

import { AppState } from '../../store';
import { OrderActions } from '../../store/order';

import { OrderComponentData } from './order.component.data';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

    private restaurant$: Observable<RestaurantResultV2>;
    private menu$: Observable<CustomerMenuResultV2>;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private orderActions: OrderActions
    ) { }

    ngOnInit() {
        let orderData = this.route.data.map((data: { order: OrderComponentData}) => data.order);
        this.restaurant$ = orderData.map(o => o.restaurant);
        this.menu$ = orderData.map(o => o.menu);
    }

    selectItem(item: CustomerMenuItemResultV2) {
        // this.restaurant$.subscribe(r => this.store.dispatch(this.orderActions.addItem(null, item, r)));
        Observable
            .combineLatest([
                this.restaurant$,
                this.store.select(o => o.order)
            ])
            .first()
            .subscribe(([restaurant, orderState]) => {
                this.store.dispatch(this.orderActions.addItem(orderState, item, restaurant));
            });
    }
}