import { NgModule, ModuleWithProviders, Provider, ValueProvider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { OrderBasketComponent } from './components';

import { OrderFactory } from './services';
import { OrderActions } from './store'; 

@NgModule({
    imports: [
        BrowserModule,
        HttpModule
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
