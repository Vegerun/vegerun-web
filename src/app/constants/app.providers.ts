import { Provider, ValueProvider } from '@angular/core';

import { API_BASE_URL, VegerunClient } from '../vegerun-client';

import { UserActions } from '../user/user.actions';
import { UserService } from '../user/user.service';

export const APP_PROVIDERS: Provider[] = [
    UserActions,
    UserService,

    { provide: API_BASE_URL, useValue: 'http://localhost:5000' } as ValueProvider,
    VegerunClient
];
