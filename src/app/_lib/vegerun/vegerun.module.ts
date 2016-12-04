import { NgModule, ModuleWithProviders, Provider, ValueProvider } from '@angular/core';

import { VegerunClient, API_BASE_URL} from './_swagger-gen/v1';
import { Vegerun2Client, API_BASE_URL as API_BASE_URL_2 } from './_swagger-gen/v2';
import { OrderItemFactory, OrderItemComparer } from './orders';

@NgModule()
export class VegerunModule {
    static forRoot(vegerunBaseUrl: string): ModuleWithProviders {
        return {
            ngModule: VegerunModule,
            providers: <Provider[]>[
                VegerunClient,
                Vegerun2Client,
                <ValueProvider>{ provide: API_BASE_URL, useValue: vegerunBaseUrl },
                <ValueProvider>{ provide: API_BASE_URL_2, useValue: vegerunBaseUrl },

                OrderItemFactory,
                OrderItemComparer
            ]
        }
    }
}