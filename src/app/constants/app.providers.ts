import { Provider, ValueProvider } from '@angular/core';
import { API_BASE_URL, VegerunClient } from '../vegerun-client';
import { API_BASE_URL as API_BASE_URL_2, Vegerun2Client } from '../vegerun-2-client';

import { Logger } from '../services/logger';
import { HostingEnvironment } from '../services/hosting-environment';
import { LocationSearchModeResolver } from '../services/location-search-mode.resolver';
import { NavigationCommandsResolver } from '../services/navigation-commands.resolver';

import { SearchComponentResolve } from '../pages/search/search.component.resolve';
import { OrderComponentResolve } from '../pages/order/order.component.resolve';

import { UserActions } from '../user/user.actions';
import { UserService } from '../user/user.service';

export const APP_PROVIDERS: Provider[] = [
    UserActions,
    UserService,

    Logger,
    HostingEnvironment,
    LocationSearchModeResolver,
    NavigationCommandsResolver,

    SearchComponentResolve,
    OrderComponentResolve,

    { provide: API_BASE_URL, useValue: 'http://localhost:5000' } as ValueProvider,
    VegerunClient,
    { provide: API_BASE_URL_2, useValue: 'http://localhost:5000' } as ValueProvider,
    Vegerun2Client
];
