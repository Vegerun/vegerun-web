import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { RestaurantResultV2, CustomerMenuResultV2 } from '../../vegerun-2-client';

import { OrderComponentData } from './order.component.data';

@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

    private restaurant$: Observable<RestaurantResultV2>;
    private menu$: Observable<CustomerMenuResultV2>;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        let data = this.route.data.map((data: { order: OrderComponentData}) => data.order);
        this.restaurant$ = data.map(d => d.restaurant);
        this.menu$ = data.map(d => d.menu);
    }
}