import { NgModule, ModuleWithProviders, Provider, ValueProvider } from '@angular/core';

import { VegerunModule } from '../../_lib/vegerun';

import { LoggingService, ScriptLoaderService } from './services';

@NgModule({
    imports: [
        VegerunModule.forRoot('http://localhost:5000')
    ],
    providers: [
        LoggingService,
        ScriptLoaderService
    ]
})
export class SharedModule { }