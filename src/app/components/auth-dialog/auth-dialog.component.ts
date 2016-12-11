import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

export enum AuthDialogMode {
    Login,

    Register
};

@Component({
    selector: 'app-auth-dialog',
    templateUrl: './auth-dialog.component.html',
    styleUrls: ['./auth-dialog.component.css']
})
export class AuthDialogComponent {

    public mode: AuthDialogMode = AuthDialogMode.Login;

    private AuthDialogMode = AuthDialogMode;

    constructor(
        private dialogRef: MdDialogRef<AuthDialogComponent>
    ) { }
}
