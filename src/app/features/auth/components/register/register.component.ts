import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    @Output() onRegister = new EventEmitter();
    @Output() onLoginRequested = new EventEmitter();

    private form: FormGroup;

    constructor(
        private formBuilder: FormBuilder
    ) { }
}
