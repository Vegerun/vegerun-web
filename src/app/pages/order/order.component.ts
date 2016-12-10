import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';

import { OrderItemResult, OrderItemCreate } from '../../_lib/vegerun/orders';
import { CustomerMenuResult, CustomerMenuItemResult } from '../../_lib/vegerun/menus';
import { RestaurantResult } from '../../_lib/vegerun/restaurants';

import { AppState } from '../../store';
import { OrderState, OrderActions, OrderFactory, OrderModel, OrderItemModel } from '../../features/orders';
import { OrderComponentData } from './order.component.data';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

    private isOrderLoading$: Observable<boolean>;
    private localOrder$: Observable<OrderItemCreate[]>;
    private serverOrder$: Observable<OrderItemResult[]>;

    private restaurant$: Observable<RestaurantResult>;
    private menu$: Observable<CustomerMenuResult>;
    private order$: Observable<OrderModel>;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private orderActions: OrderActions,
        private orderFactory: OrderFactory
    )
    {
        let orderState$ = this.store.select(s => s.order);
        this.isOrderLoading$ = orderState$.map(o => o.loading || !!o.orderItems.filter(ois => ois.loading)[0]);
        this.localOrder$ = orderState$.map(o => o.orderItems.map(ois => ois.local));
        this.serverOrder$ = orderState$.map(o => o.orderItems.map(ois => ois.server));
    }

    ngOnInit() {
        let orderData = this.route.data.map((data: { order: OrderComponentData}) => data.order);
        this.restaurant$ = orderData.map(o => o.restaurant);
        this.menu$ = orderData.map(o => o.menu);

        this.order$ = Observable
            .combineLatest([
                this.store.select(o => o.order),
                this.menu$
            ])
            .map(([orderState, menu]) => this.orderFactory.createOrder(orderState, menu));
    }

    selectItem(item: CustomerMenuItemResult) {
        this.combineWithState(this.restaurant$).subscribe(([restaurant, orderState]) =>
            this.store.dispatch(this.orderActions.createItem(orderState, item, restaurant)));
    }

    openOrderItem(item: OrderItemModel) {
        // Open modal for configuring order item?
    }

    incrementOrderItem(item: OrderItemModel) {
        this.dispatchWithState(state => this.orderActions.incrementItem(state, item.stateId));
    }

    decrementOrderItem(item: OrderItemModel) {
        this.dispatchWithState(state => this.orderActions.decrementItem(state, item.stateId));
    }

    removeOrderItem(item: OrderItemModel) {
        this.dispatchWithState(state => this.orderActions.removeItem(state, item.stateId));
    }

    private combineWithState(...array: Observable<{}>[]): Observable<any[]> {
        return Observable
            .combineLatest([
                ...array,
                this.store.select(o => o.order)
            ])
            .first();
    }

    private dispatchWithState(action: (OrderState) => Action) {
        return this.store
            .select(s => s.order)
            .first()
            .subscribe(state => this.store.dispatch(action(state)));
    }
}