import { Injectable } from '@angular/core';

import { CustomerMenuResult, CustomerMenuSectionResult, CustomerMenuItemResult } from '../../../_lib/vegerun/menus';

import { OrderState, OrderItemState } from '../store';
import { OrderModel, OrderItemModel } from '../models';

Injectable()
export class OrderFactory {

    createOrder(state: OrderState, menu: CustomerMenuResult): OrderModel {
        let itemsById = menu.sections
            .selectMany((s: CustomerMenuSectionResult) => s.items)
            .keyBy((i: CustomerMenuItemResult) => i.id);

        return <OrderModel>{
            items: state.orderItems.map(ois => this.createOrderItem(ois, itemsById.get(ois.local.itemId)))
        };
    }

    createOrderItem(state: OrderItemState, item: CustomerMenuItemResult): OrderItemModel {
        return Object.assign({}, state.local, <OrderItemModel>{
            stateId: state.id,
            item
        });
    }
}