import { Injectable } from '@angular/core';

import { OrderItemCreate, OrderItemResult } from './_swagger-gen';
import { CustomerMenuResult, CustomerMenuSectionResult, CustomerMenuItemResult } from '../menus';

Injectable()
export class OrderPriceCalculator {

    calculatePrice(orderItems: (OrderItemResult | OrderItemCreate)[], menu: CustomerMenuResult): number {
        let itemsById = this._getItemsById(menu);
        return orderItems.reduce(
            (total, orderItem) => total + this._calculateUnitPrice(orderItem, itemsById),
            0
        );
    }

    calculateUnitPrice(orderItem: (OrderItemResult | OrderItemCreate), menu: CustomerMenuResult) {
        return this._calculateUnitPrice(orderItem, this._getItemsById(menu));
    }

    private _getItemsById(menu: CustomerMenuResult): Map<string, CustomerMenuItemResult> {
        return menu.sections
            .selectMany((s: CustomerMenuSectionResult) => s.items)
            .keyBy((i: CustomerMenuItemResult) => i.id);
    }

    private _calculateUnitPrice(orderItem: (OrderItemResult | OrderItemCreate), menu: Map<string, CustomerMenuItemResult>) {
        let item = menu.get(orderItem.itemId);
        let optionsPrice = orderItem.options.reduce(
            (total, orderOption) => {
                let option = item.options.find(o => o.id === orderOption.optionId);
                let value = option.values.find(v => v.id === orderOption.selectionId);
                return total + value.price;
            },
            0
        );
        return (item.price + optionsPrice) * orderItem.count;
    }
}