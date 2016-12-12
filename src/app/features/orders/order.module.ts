import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { SharedModule } from '../shared';

import { OrderBasketComponent } from './components';
import { OrderFactory } from './services';
import { OrderActions } from './store'; 

@NgModule({
    imports: [
        HttpModule,
        CommonModule,
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
