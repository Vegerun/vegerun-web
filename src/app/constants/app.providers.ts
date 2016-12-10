import { Provider, ValueProvider } from '@angular/core';

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
    OrderComponentResolve
];
