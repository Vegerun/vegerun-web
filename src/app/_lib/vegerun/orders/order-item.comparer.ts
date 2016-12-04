import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { OrderItem } from './models/order-item.model';
import { OrderItemOption } from './models/order-item-option.model';

Injectable()
export class OrderItemComparer {

    public static areEqual(a: OrderItem, b: OrderItem): boolean {
        if (a.itemId !== b.itemId) {
            return false;
        }

        if (!OrderItemComparer.areOrderItemOptionsArraysEqual(a.options, b.options)) {
            return false;
        }

        if (!OrderItemComparer.areOrderItemOptionsArraysEqual(a.excludedOptions, b.excludedOptions)) {
            return false;
        }

        return true;
    }

    private static areOrderItemOptionsArraysEqual(a: OrderItemOption[], b: OrderItemOption[]): boolean {
        if (_.differenceWith(a, b, OrderItemComparer.areOrderItemOptionsEqual).length > 0) {
            return false;
        }

        if (_.differenceWith(b, a, OrderItemComparer.areOrderItemOptionsEqual).length > 0) {
            return false;
        }

        return true;
    }

    private static areOrderItemOptionsEqual(a: OrderItemOption, b: OrderItemOption): boolean {
        return true;
    }
}