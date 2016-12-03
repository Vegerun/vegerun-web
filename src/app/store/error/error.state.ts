export interface ErrorState {
    errors: any[],

    lastError?: any 
}

export const DEFAULT_ERROR_STATE: ErrorState = {
    errors: []
}