import { Injectable } from '@angular/core';

import { OrderItemCreate } from './_swagger-gen';
import { CustomerMenuItemResult } from '../menus';

Injectable()
export class OrderItemFactory {

    createOrderItem(item: CustomerMenuItemResult): OrderItemCreate {
        return {
            orderId: null,
            itemId: item.id,
            options: [],
            excludedOptions: [],
            instructions: null,
            count: 1
        }
    }
}