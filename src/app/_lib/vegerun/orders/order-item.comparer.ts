import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { OrderItem } from './models/order-item.model';
import { OrderItemOption } from './models/order-item-option.model';

Injectable()
export class OrderItemComparer {

    public areEqual(a: OrderItem, b: OrderItem): boolean {
        return a.count === b.count && this.areContentsEqual(a, b);
    }

    public areContentsEqual(a: OrderItem, b: OrderItem): boolean {
        if (a.itemId !== b.itemId) {
            return false;
        }

        // if (a.instructions !== b.instructions) {
        //     return false;
        // }

        if (!this.areOrderItemOptionsArraysEqual(a.options, b.options)) {
            return false;
        }

        if (!this.areOrderItemOptionsArraysEqual(a.excludedOptions, b.excludedOptions)) {
            return false;
        }

        return true;
    }

    private areOrderItemOptionsArraysEqual(a: OrderItemOption[], b: OrderItemOption[]): boolean {
        if (_.differenceWith(a, b, this.areOrderItemOptionsEqual).length > 0) {
            return false;
        }

        if (_.differenceWith(b, a, this.areOrderItemOptionsEqual).length > 0) {
            return false;
        }

        return true;
    }

    private areOrderItemOptionsEqual(a: OrderItemOption, b: OrderItemOption): boolean {
        return true;
    }
}