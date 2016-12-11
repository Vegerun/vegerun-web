import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { OrderPriceCalculator, OrderItemResult } from '../../../../_lib/vegerun/orders';
import { CustomerMenuResult } from '../../../../_lib/vegerun/menus';

import { OrderModel, OrderItemModel } from '../../models';

@Component({
    selector: 'app-order-basket',
    templateUrl: './order-basket.component.html',
    styleUrls: ['./order-basket.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBasketComponent {
    @Input() order: OrderModel;
    @Input() menu: CustomerMenuResult;
    @Output() onOrderItemSelected = new EventEmitter<OrderItemResult>();
    @Output() onOrderItemIncremented = new EventEmitter<OrderItemResult>();
    @Output() onOrderItemDecremented = new EventEmitter<OrderItemResult>();
    @Output() onOrderItemRemoved = new EventEmitter<OrderItemResult>();

    constructor(
        private orderPriceCalculator: OrderPriceCalculator
    ) { }

    get orderPrice(): number {
        return this.orderPriceCalculator.calculatePrice(this.order.items, this.menu);
    }

    getUnitPrice(orderItem: OrderItemModel): number {
        return this.orderPriceCalculator.calculateUnitPrice(orderItem, this.menu);
    }
}