import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Store } from '@ngrx/store';

// import { VegerunClient, LocationResult, LocationResultStatus } from '../../_lib/vegerun/_swagger-gen/v1';

import { AuthService } from '../../../../_lib/vegerun';

import { AppState } from '../../../../store';

import { AuthActions } from '../../store';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    @Output() onLogin = new EventEmitter();
    @Output() onRegisterRequested = new EventEmitter();

    private form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private authService: AuthService,
        private authActions: AuthActions
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });

        let auth$ = this.store.select(s => s.auth);

        let initialSessionTimestamp = null
        auth$.first().subscribe(state => {
            initialSessionTimestamp = state.sessionTimestamp;
        });

        auth$.first(state => state.sessionTimestamp !== initialSessionTimestamp)
            .subscribe(state => {
                this.onLogin.emit();
            });
    }

    login() {
        if (this.form.valid) {
            this.store.dispatch(this.authActions.login(
                this.form.value['email'],
                this.form.value['password']
            ));
        }
    }
}
