import { ActionReducer, Action } from '@ngrx/store';

import { OrderState, DEFAULT_ORDER_STATE } from './order.state';
import { ORDER_ACTION_NAMES } from './order.actions';

export const orderReducer: ActionReducer<OrderState> = (state: OrderState = DEFAULT_ORDER_STATE, { type, payload }: Action) => {
    switch (type) {
        case ORDER_ACTION_NAMES.ADD_ITEM:
            return {
                items: [...state.items, payload]
            };

        case ORDER_ACTION_NAMES.REMOVE_ITEM:
            return {
                items: state.items.filter(i => i.id !== payload)
            };

        case ORDER_ACTION_NAMES.UPDATE_ITEM_COUNT:
            return {
                items: state.items.map(item => {
                    if (item.id === payload.id) {
                        return Object.assign({}, item, { count: payload.count });
                    } else {
                        return item;
                    }
                })
            };

        default:
            return state;
    }
}