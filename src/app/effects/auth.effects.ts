import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs';

import { AuthService } from '../_lib/vegerun';

import { AppState } from '../store';

import {
    AuthState, AuthActions, AUTH_ACTION_NAMES,
    LoginPayload, LoginStartedPayload, LoginCompletedPayload, LoginFailedPayload
} from '../features/auth';

@Injectable()
export class AuthEffects {

    constructor(
        private store: Store<AppState>,
        private authActions: AuthActions,
        private authService: AuthService,
        private actions$: Actions
    ) { }

    @Effect() loginEffect = this.actions$
        .ofType(AUTH_ACTION_NAMES.LOGIN)
        .map<LoginPayload>(toPayload)
        .map(payload => this.authActions.loginStarted(payload.email, payload.password));

    @Effect() loginStartedEffect = this.actions$
        .ofType(AUTH_ACTION_NAMES.LOGIN_STARTED)
        .map<LoginStartedPayload>(toPayload)
        .switchMap(payload => this.authService
            .login(payload.email, payload.password)
            .map(res => this.authActions.loginCompleted(res, payload.email))
            .catch(err => Observable.of(this.authActions.loginFailed(err, payload.email))));
}