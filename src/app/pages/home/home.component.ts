import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LocationResult } from '../../_lib/vegerun/_swagger-gen/v1';

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

    navigateToRestaurants(location: LocationResult) {
        this.router.navigate([
            '/search',
            location.town.slug,
            location.normalizedPostcode
        ]);
    }

    locationMissing(locationResult: LocationResult) {
        alert('location not found');
    }
}
