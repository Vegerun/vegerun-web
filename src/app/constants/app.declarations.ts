import { DashboardComponent } from '../features/dashboard.component';

import { HomeComponent } from '../pages/home/home.component';
import { ErrorNotFoundComponent } from '../pages/error-not-found/error-not-found.component';
import { SearchComponent } from '../pages/search/search.component';
import { OrderComponent } from '../pages/order/order.component';

import { LocationSearchComponent } from '../components/location-search/location-search.component';
import { RestaurantResultList } from '../components/restaurant-result-list/restaurant-result-list.component';
import { RestaurantResult } from '../components/restaurant-result/restaurant-result.component';
import { MenuComponent } from '../components/menu/menu.component';
import { MenuItemListComponent } from '../components/menu-item-list/menu-item-list.component';
import { OrderBasketComponent } from '../components/order-basket/order-basket.component';

export const APP_DECLARATIONS = [
    DashboardComponent,
    
    HomeComponent,
    ErrorNotFoundComponent,
    SearchComponent,
    OrderComponent,

    LocationSearchComponent,
    RestaurantResultList,
    RestaurantResult,
    MenuComponent,
    MenuItemListComponent,
    OrderBasketComponent
];
