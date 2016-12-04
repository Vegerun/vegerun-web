import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';

import { VegerunClient, LocationResult, LocationResultStatus } from '../../_lib/vegerun/_swagger-gen/v1';

import { LocationSearchModeResolver } from '../../services/location-search-mode.resolver';
import { LocationSearchMode } from '../../services/models/location-search-mode';

@Component({
    selector: 'app-location-search',
    templateUrl: './location-search.component.html',
    styleUrls: ['./location-search.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSearchComponent implements OnInit {
    @Input() initialPostcode: string;
    @Output() onLocationFound = new EventEmitter<LocationResult>();
    @Output() onLocationMissing = new EventEmitter<LocationResult>();

    form: FormGroup;
    mode: LocationSearchMode;

    constructor(
        private formBuilder: FormBuilder,
        private locationSearchModeResolver: LocationSearchModeResolver,
        private vegerunClient: VegerunClient
    )
    {
        this.form = formBuilder.group({
            postcode: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
        this.mode = this.locationSearchModeResolver.resolve();
        if (this.mode !== LocationSearchMode.Postcode) {
            throw new Error('Unhandled location search mode');
        }

        this.form.patchValue({
            postcode: this.initialPostcode
        });
    }

    search() {
        if (this.form.valid) {
            this.vegerunClient.apiV1LocationsGetByPostcodeGet(this.form.value['postcode'])
                .subscribe(locationResult => {
                    if (locationResult.status === LocationResultStatus._0) {
                        this.onLocationFound.emit(locationResult);
                    } else {
                        this.onLocationMissing.emit(locationResult);
                    }
                });
        }
    }
}
