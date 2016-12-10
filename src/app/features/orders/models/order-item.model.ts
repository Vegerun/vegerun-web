import { OrderItemResult } from '../../../_lib/vegerun/orders';
import { CustomerMenuItemResult } from '../../../_lib/vegerun/menus';

export interface OrderItemModel extends OrderItemResult {
    stateId: number;

    item: CustomerMenuItemResult;
}