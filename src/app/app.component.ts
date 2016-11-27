import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VegerunClient } from './vegerun-client';

import { MOBILE } from './services/constants';

const views: Object[] = [
    {
        name: 'Dashboard',
        icon: 'home',
        link: ['']
    },
    {
        name: 'Lazy',
        icon: 'file_download',
        link: ['lazy']
    },
    {
        name: 'Sync',
        icon: 'done',
        link: ['sync']
    },
    {
        name: 'Bad Link',
        icon: 'error',
        link: ['wronglink']
    }
];

@Component({
    selector: 'my-app',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html'
})
export class AppComponent {
    showMonitor = (ENV === 'development' && !AOT &&
        ['monitor', 'both'].includes(STORE_DEV_TOOLS) // set in constants.js file in project root
    );
    mobile = MOBILE;
    sideNavMode = MOBILE ? 'over' : 'side';
    views = views;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private vegerunClient: VegerunClient
    )
    {
        vegerunClient.apiV1LocationsGetByPostcodeGet('EC2A2EX')
            .flatMap(location => vegerunClient.apiV1RestaurantsSearchSearchPost({
                latitude: location.position.latitude,
                longitude: location.position.longitude,
                townId: location.town.id,
                postcode: location.normalizedPostcode
            }))
            .subscribe(results => {
                console.log('got results!' + results);
            });
    }

    activateEvent(event) {
        if (ENV === 'development') {
            console.log('Activate Event:', event);
        }
    }

    deactivateEvent(event) {
        if (ENV === 'development') {
            console.log('Deactivate Event', event);
        }
    }
}
