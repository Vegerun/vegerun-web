import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { VegerunClient } from '../../_lib/vegerun/_swagger-gen/v1';

import { SearchComponentData } from './search.component.data';

@Injectable()
export class SearchComponentResolve implements Resolve<SearchComponentData> {

    constructor(
        private vegerunClient: VegerunClient
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<SearchComponentData>|boolean {
        let { postcode } = route.params;
        if (!postcode) {
            return false;
        }
        return this.vegerunClient.apiV1LocationsGetByPostcodeGet(postcode)
            .map(location => ({ location }))
            .toPromise()
    }
}