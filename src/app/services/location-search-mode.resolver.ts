import { Injectable } from '@angular/core';

import { LocationSearchMode } from './models/location-search-mode';

@Injectable()
export class LocationSearchModeResolver {

    resolve(): LocationSearchMode {
        return LocationSearchMode.Postcode;
    }
}
