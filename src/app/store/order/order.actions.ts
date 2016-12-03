import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { CustomerMenuItemResultV2 } from '../../vegerun-2-client';

const prefix = actionName => `[Order] ${actionName}`;

export const ORDER_ACTION_NAMES = {
    ADD_ITEM: prefix('Add Item'),
    REMOVE_ITEM: prefix('Remove Item'),
    UPDATE_ITEM_COUNT: prefix('Update Item Count')
};

@Injectable()
export class OrderActions {

    addItem(item: CustomerMenuItemResultV2): Action {
        return {
            type: ORDER_ACTION_NAMES.ADD_ITEM,
            payload: item
        };
    }

    removeItem(item: CustomerMenuItemResultV2): Action {
        return {
            type: ORDER_ACTION_NAMES.REMOVE_ITEM,
            payload: item.id
        };
    }

    incrementItem(item: any): Action {
        return this.updateItemCount(item, 1);
    }

    decrementItem(item: any): Action {
        if (item.count === 1) {
            return this.removeItem(item);
        } else {
            return this.updateItemCount(item, -1);
        }
    }

    private updateItemCount(item: any, magnitude: Number): Action {
        return {
            type: ORDER_ACTION_NAMES.UPDATE_ITEM_COUNT,
            payload: {
                id: item.id,
                count: item.count + magnitude
            }
        }
    }
}