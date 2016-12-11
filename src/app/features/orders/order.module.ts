import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared';

import { OrderBasketComponent } from './components';
import { OrderFactory } from './services';
import { OrderActions } from './store'; 

@NgModule({
    imports: [
        HttpModule,
        SharedModule
    ],
    declarations: [
        OrderBasketComponent
    ],
    providers: [
        OrderActions,
        OrderFactory
    ],
    exports: [
        OrderBasketComponent
    ]
})
export class OrderModule { }
