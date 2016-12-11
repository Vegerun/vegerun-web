import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, Action } from '@ngrx/store';

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

    private restaurant$: Observable<RestaurantResult>;
    private menu$: Observable<CustomerMenuResult>;
    private order$: Observable<OrderModel>;

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private orderActions: OrderActions,
        private orderFactory: OrderFactory
    ) { }

    ngOnInit() {
        let orderData = this.route.data.map((data: { order: OrderComponentData}) => data.order);
        this.restaurant$ = orderData.map(o => o.restaurant);
        this.menu$ = orderData.map(o => o.menu);
        
        this.order$ = this.combineWithState(this.menu$, this.restaurant$).map(([m, r, s]) => {
            let menu = <CustomerMenuResult>m, restaurant = <RestaurantResult>r, state = <OrderState>s;
            if (state.orderId || state.loading) {
                if (state.restaurantId === restaurant.id) {
                    return this.orderFactory.createOrder(state, menu);
                } else {
                    this.store.dispatch(this.orderActions.clear())
                }
            }
            return null;
        });
    }

    selectItem(item: CustomerMenuItemResult) {
        this.combineWithState(this.restaurant$)
            .first()
            .subscribe(([restaurant, orderState]) =>
                this.store.dispatch(this.orderActions.createItem(orderState, item, restaurant)));
    }

    openOrderItem(item: OrderItemModel) {
        // TODO: Open modal for configuring order item?
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
            ]);
    }

    private dispatchWithState(action: (OrderState) => Action) {
        return this.store
            .select(s => s.order)
            .first()
            .subscribe(state => this.store.dispatch(action(state)));
    }
}