import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { VegerunClient, LocationResult, LocationResultStatus } from '../vegerun-client';

@Injectable()
export class LocationResolve implements Resolve<LocationResult> {

    constructor(
        private vegerunClient: VegerunClient
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<LocationResult>|boolean {
        let postcode = route.params['postcode'];
        if (!postcode) {
            return false;
        }
        return this.vegerunClient.apiV1LocationsGetByPostcodeGet(postcode).toPromise()
    }
}