import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { AuthModel } from '../../../_lib/vegerun';

import { AUTH_ACTION_NAMES } from './auth.actions.names';
import {
    LoginPayload, LoginStartedPayload, LoginCompletedPayload, LoginFailedPayload
} from './auth.actions.payloads';

@Injectable()
export class AuthActions {

    login(email: string, password: string): Action {
        return {
            type: AUTH_ACTION_NAMES.LOGIN,
            payload: <LoginPayload>{
                email,
                password
            }
        }
    }

    loginStarted(email: string, password: string): Action {
        return {
            type: AUTH_ACTION_NAMES.LOGIN_STARTED,
            payload: <LoginStartedPayload>{
                email,
                password
            }
        }
    }

    loginCompleted(auth: AuthModel, email: string): Action {
        return {
            type: AUTH_ACTION_NAMES.LOGIN_COMPLETED,
            payload: <LoginCompletedPayload>{
                auth,
                email
            }
        }
    }

    loginFailed(error: any, email: string): Action {
        return {
            type: AUTH_ACTION_NAMES.LOGIN_FAILED,
            payload: <LoginFailedPayload>{
                error,
                email
            }
        }
    }

    logout(): Action {
        return {
            type: AUTH_ACTION_NAMES.LOGOUT
        }
    }
}