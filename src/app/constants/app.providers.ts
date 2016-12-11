import { Provider, ValueProvider } from '@angular/core';

import { LocationSearchModeResolver } from '../services/location-search-mode.resolver';
import { NavigationCommandsResolver } from '../services/navigation-commands.resolver';

import { SearchComponentResolve } from '../pages/search/search.component.resolve';
import { OrderComponentResolve } from '../pages/order/order.component.resolve';

export const APP_PROVIDERS: Provider[] = [
    LocationSearchModeResolver,
    NavigationCommandsResolver,

    SearchComponentResolve,
    OrderComponentResolve
];
