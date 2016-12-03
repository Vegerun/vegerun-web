export interface OrderState {
    items: any[],

    error?: any
}

export const DEFAULT_ORDER_STATE: OrderState = {
    items: []
}