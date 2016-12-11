import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { SharedModule } from '../shared';

import { LoginComponent, RegisterComponent } from './components';
import { AuthActions } from './store';

@NgModule({
    imports: [
        HttpModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule
    ],
    declarations: [
        LoginComponent,
        RegisterComponent
    ],
    providers: [
        AuthActions
    ],
    exports: [
        LoginComponent,
        RegisterComponent
    ]
})
export class AuthModule { }