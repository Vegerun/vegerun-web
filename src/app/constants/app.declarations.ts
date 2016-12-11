import { HomeComponent } from '../pages/home/home.component';
import { ErrorNotFoundComponent } from '../pages/error-not-found/error-not-found.component';
import { SearchComponent } from '../pages/search/search.component';
import { OrderComponent } from '../pages/order/order.component';

import {
    AuthDialogComponent,
    LocationSearchComponent,
    MenuComponent,
    MenuItemListComponent,
    RestaurantResultComponent,
    RestaurantResultListComponent
} from '../components';

export const APP_DECLARATIONS = [
    HomeComponent,
    ErrorNotFoundComponent,
    SearchComponent,
    OrderComponent,

    LocationSearchComponent,
    RestaurantResultListComponent,
    RestaurantResultComponent,
    MenuComponent,
    MenuItemListComponent,
    AuthDialogComponent
];
