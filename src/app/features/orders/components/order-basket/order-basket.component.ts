import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { OrderItemResult } from '../../../../_lib/vegerun/orders';
import { CustomerMenuResult } from '../../../../_lib/vegerun/menus';

import { OrderModel, OrderItemModel } from '../../models';

@Component({
    selector: 'app-order-basket',
    templateUrl: './order-basket.component.html',
    styleUrls: ['./order-basket.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBasketComponent {
    @Input() order: OrderModel[];
    @Output() onOrderItemSelected = new EventEmitter<OrderItemResult>();
    @Output() onOrderItemIncremented = new EventEmitter<OrderItemResult>();
    @Output() onOrderItemDecremented = new EventEmitter<OrderItemResult>();
    @Output() onOrderItemRemoved = new EventEmitter<OrderItemResult>();
}