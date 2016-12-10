import { OrderItemResultV2, CustomerMenuResultV2, CustomerMenuSectionResultV2, CustomerMenuItemResultV2 } from '../../_lib/vegerun/_swagger-gen/v2';
import { OrderState, OrderItemState } from '../../store/order';

export interface OrderModel {
    items: OrderItemModel[];
}

export interface OrderItemModel extends OrderItemResultV2 {
    stateId: number;

    item: CustomerMenuItemResultV2;
}

export function createOrderModel(state: OrderState,  menu: CustomerMenuResultV2) {
    let itemsById = menu.sections
        .selectMany((s: CustomerMenuSectionResultV2) => s.items)
        .keyBy((i: CustomerMenuItemResultV2) => i.id);

    return <OrderModel>{
        items: state.orderItems.map(ois => createOrderItemModel(ois, itemsById.get(ois.local.itemId)))
    };
}

export function createOrderItemModel(state: OrderItemState, item: CustomerMenuItemResultV2): OrderItemModel {
    return Object.assign({}, state.local, <OrderItemModel>{
        stateId: state.id,
        item
    });
}