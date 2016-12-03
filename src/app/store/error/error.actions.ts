import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

const prefix = action => `[Error] ${action}`;

const ADD_ERROR = prefix('Emitted');

export const ERROR_ACTION_NAMES = {
    ADD_ERROR
}

@Injectable()
export class ErrorActions {

    addError(err: any) {
        return {
            type: ADD_ERROR,
            payload: err
        };
    }
}