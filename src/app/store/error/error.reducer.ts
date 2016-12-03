import { ActionReducer, Action } from '@ngrx/store';

import { ErrorState, DEFAULT_ERROR_STATE } from './error.state';
import { ERROR_ACTION_NAMES } from './error.actions';

export const errorReducer: ActionReducer<ErrorState> = (state: ErrorState = DEFAULT_ERROR_STATE, { type, payload }: Action) => {
    switch (type) {
        case ERROR_ACTION_NAMES.ADD_ERROR:
            return {
                errors: [...state.errors, payload],
                lastError: payload
            };

        default:
            return state;
    }
};