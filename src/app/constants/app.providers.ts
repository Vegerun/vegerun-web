import { Provider, ValueProvider } from '@angular/core';

import { Logger } from '../services/logger';
import { LocationSearchModeResolver } from '../services/location-search-mode.resolver';
import { NavigationCommandsResolver } from '../services/navigation-commands.resolver';

import { SearchComponentResolve } from '../pages/search/search.component.resolve';
import { OrderComponentResolve } from '../pages/order/order.component.resolve';

export const APP_PROVIDERS: Provider[] = [
    Logger,
    LocationSearchModeResolver,
    NavigationCommandsResolver,

    SearchComponentResolve,
    OrderComponentResolve
];
