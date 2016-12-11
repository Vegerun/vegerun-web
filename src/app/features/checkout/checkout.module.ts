import { NgModule, Provider, ValueProvider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared';

import { StripeService, STRIPE_PUBLISHABLE_KEY } from './services';
import { CheckoutPage } from './pages';

const CHECKOUT_ROUTES = [
    {
        path: '',
        component: CheckoutPage
    }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forChild(CHECKOUT_ROUTES)
    ],
    declarations: [
        CheckoutPage
    ],
    providers: <Provider[]>[
        <ValueProvider>{ provide: STRIPE_PUBLISHABLE_KEY, useValue: 'pk_test_YoYFRaUZTbyp9ITOLdSpe0Yr' },
        StripeService
    ]
})
export class CheckoutModule { }