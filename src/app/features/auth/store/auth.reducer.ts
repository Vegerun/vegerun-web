import { ActionReducer, Action } from '@ngrx/store';

import '../../../../extensions/array.extensions';

import { AuthState, DEFAULT_AUTH_STATE } from './auth.state';
import { AUTH_ACTION_NAMES } from './auth.actions.names';
import {
    LoginPayload, LoginStartedPayload, LoginCompletedPayload, LoginFailedPayload
} from './auth.actions.payloads';

export const authReducer: ActionReducer<AuthState> = (state: AuthState = DEFAULT_AUTH_STATE, { type, payload }: Action) => {
    switch (type) {

        case AUTH_ACTION_NAMES.LOGIN: {
            let { email } = <LoginPayload>payload;
            return Object.assign({}, state, { email });
        }

        case AUTH_ACTION_NAMES.LOGIN_STARTED: {
            return Object.assign({}, state, { loading: true });
        }

        case AUTH_ACTION_NAMES.LOGIN_COMPLETED: {
            let { auth } = <LoginCompletedPayload>payload;
            return Object.assign({}, state, auth, {
                loading: false,
                sessionTimestamp: new Date().getTime()
            });
        }

        case AUTH_ACTION_NAMES.LOGIN_FAILED: {
            //let { error } = <LoginFailedPayload>payload;
            return Object.assign({}, state, { loading: false });
        }

        case AUTH_ACTION_NAMES.LOGOUT: {
            return DEFAULT_AUTH_STATE;
        }

        default:
            return state;
    }
}