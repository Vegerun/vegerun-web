import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { CustomerMenuResultV2, OrderItemResultV2 } from '../../_lib/vegerun/_swagger-gen/v2';
import { OrderModel, OrderItemModel } from '../../services/models/order.model';

@Component({
    selector: 'app-order-basket',
    templateUrl: './order-basket.component.html',
    styleUrls: ['./order-basket.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBasketComponent {
    @Input() order: OrderModel[];
    @Output() onOrderItemSelected = new EventEmitter<OrderItemResultV2>();
    @Output() onOrderItemIncremented = new EventEmitter<OrderItemResultV2>();
    @Output() onOrderItemDecremented = new EventEmitter<OrderItemResultV2>();
    @Output() onOrderItemRemoved = new EventEmitter<OrderItemResultV2>();
}