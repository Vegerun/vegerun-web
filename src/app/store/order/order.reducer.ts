import { ActionReducer, Action } from '@ngrx/store';

import { OrderState, DEFAULT_ORDER_STATE } from './order.state';
import { ORDER_ACTION_NAMES } from './order.actions';

export const orderReducer: ActionReducer<OrderState> = (state: OrderState = DEFAULT_ORDER_STATE, { type, payload }: Action) => {
    switch (type) {
        case ORDER_ACTION_NAMES.ADD_ITEM: {
            let itemId = payload.id;
            let existingItem = getItemById(state, itemId);
            if (existingItem) {
                return updateItemCount(state, itemId, existingItem.count + 1);
            } else {
                return {
                    items: [...state.items, payload]
                };
            }
        }
            
        case ORDER_ACTION_NAMES.ADD_ITEM_COMPLETED: {
            let { item, assignedId } = payload;
            let existingItem = getItemByObjectReference(state, item);
            if (existingItem) {
                return {
                    items: state.items.map(existingItem => {
                        if (item === existingItem) {
                            return Object.assign({}, existingItem, { id: assignedId })
                        } else {
                            return existingItem;
                        }
                    })
                };
            } else { // Item has been removed
                return state;
            }
        }
            
        case ORDER_ACTION_NAMES.ADD_ITEM_FAILED: {
            let { item, err } = payload;
            let existingItem = getItemByObjectReference(state, item);
            if (existingItem) {
                // add error
                return {
                    items: state.items.filter(i => existingItem !== item),
                    error: err
                };
            } else { // Item has been removed
                return state;
            }
        }

        case ORDER_ACTION_NAMES.REMOVE_ITEM:
            return {
                items: state.items.filter(i => i.id !== payload)
            };

        case ORDER_ACTION_NAMES.UPDATE_ITEM_COUNT:
            return updateItemCount(state, payload.id, payload.count);

        default:
            return state;
    }
}

function getItemById(state: OrderState, itemId: string): any {
    return state.items.filter(i => i.id === itemId)[0];
}

function getItemByObjectReference(state: OrderState, item: any): any {
    return state.items.filter(i => i === item)[0];
}

function updateItemCount(state: OrderState, itemId: string, count: Number): OrderState {
    return {
        items: state.items.map(item => {
            if (item.id === itemId) {
                return Object.assign({}, item, { count });
            } else {
                return item;
            }
        })
    };
}