import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { LocationResult } from '../../vegerun-client';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

    private location$: Observable<LocationResult>;
    
    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.location$ = this.route.data.map((data: { location: LocationResult }) => data.location);
    }
}
