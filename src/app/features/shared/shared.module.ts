import { NgModule, ModuleWithProviders, Provider, ValueProvider } from '@angular/core';

import { VegerunModule } from '../../_lib/vegerun';

@NgModule({
    imports: [
        VegerunModule.forRoot('http://localhost:5000')
    ]
})
export class SharedModule { }