import { Injectable } from '@angular/core';

import { } from '../_swagger-gen/v1';
import { CustomerMenuItemResultV2, OrderItemCreateV2 } from '../_swagger-gen/v2';

Injectable()
export class OrderItemFactory {

    createOrderItem(item: CustomerMenuItemResultV2): OrderItemCreateV2 {
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