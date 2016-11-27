import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LocationResult } from '../../vegerun-client';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    previousPostcode: string = 'EC2A2EX';
    
    constructor(
        private router: Router
    ) { }

    navigateToRestaurants(locationResult: LocationResult) {
        this.router.navigate([
            '/search',
            locationResult.town.name.toLowerCase(),
            locationResult.normalizedPostcode
        ]);
    }

    locationMissing(locationResult: LocationResult) {
        alert('location not found');
    }
}
