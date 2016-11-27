import { Provider, ValueProvider } from '@angular/core';
import { API_BASE_URL, VegerunClient } from '../vegerun-client';

import { Logger } from '../services/logger';
import { HostingEnvironment } from '../services/hosting-environment';
import { LocationSearchModeResolver } from '../services/location-search-mode.resolver';

import { LocationResolve } from '../resolves/location.resolve';

import { UserActions } from '../user/user.actions';
import { UserService } from '../user/user.service';

export const APP_PROVIDERS: Provider[] = [
    UserActions,
    UserService,

    Logger,
    HostingEnvironment,
    LocationSearchModeResolver,

    LocationResolve,

    { provide: API_BASE_URL, useValue: 'http://localhost:5000' } as ValueProvider,
    VegerunClient
];
