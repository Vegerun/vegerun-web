import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { RestaurantResultV2, CustomerMenuResultV2, CustomerMenuItemResultV2, OrderItemResultV2, OrderItemCreateV2 } from '../../_lib/vegerun/_swagger-gen/v2';

import { AppState } from '../../store';
import { OrderActions } from '../../store/order';

import { OrderComponentData } from './order.component.data';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

    private orderSynchronizing$: Observable<boolean>;
    private localOrder$: Observable<OrderItemCreateV2[]>;
    private serverOrder$: Observable<OrderItemResultV2[]>;
    private restaurant$: Observable<RestaurantResultV2>;
    private menu$: Observable<CustomerMenuResultV2>;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private orderActions: OrderActions
    )
    {
        let orderState$ = this.store.select(s => s.order);
        this.orderSynchronizing$ = orderState$.map(o => o.orderIdLoading || !!o.orderItems.filter(ois => ois.loading)[0]);
        this.localOrder$ = orderState$.map(o => o.orderItems.map(ois => ois.local));
        this.serverOrder$ = orderState$.map(o => o.orderItems.map(ois => ois.server));
    }

    ngOnInit() {
        let orderData = this.route.data.map((data: { order: OrderComponentData}) => data.order);
        this.restaurant$ = orderData.map(o => o.restaurant);
        this.menu$ = orderData.map(o => o.menu);
    }

    selectItem(item: CustomerMenuItemResultV2) {
        Observable
            .combineLatest([
                this.restaurant$,
                this.store.select(o => o.order)
            ])
            .first()
            .subscribe(([restaurant, orderState]) => {
                this.store.dispatch(this.orderActions.createItem(orderState, item, restaurant));
            });
    }
}