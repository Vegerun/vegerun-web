import * as _ from 'lodash';

import { OrderItemCreateV2, OrderItemResultV2, OrderItemOptionCreateV2, OrderItemOptionResultV2 } from '../app/vegerun-2-client';

declare type OrderItem = OrderItemCreateV2 | OrderItemResultV2;
declare type OrderItemOption = OrderItemOptionCreateV2 | OrderItemOptionResultV2;

export class OrderItemComparer {

    public static areEqual(a: OrderItem, b: OrderItem): boolean {
        debugger;
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