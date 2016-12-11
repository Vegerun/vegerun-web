import { Component, OnInit } from '@angular/core';

import { LoggingService } from '../../../shared';
import { StripeService } from '../../services';

@Component({
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.css']
})
export class CheckoutPage implements OnInit {

    constructor(
        private stripeService: StripeService,
        private logger: LoggingService
    ) { }

    ngOnInit() {
        this.stripeService
            .createToken({
                number: new Array(16 / 2).fill('42').join(''),
                cvc: '111',
                exp_year: 2020,
                exp_month: 12
            })
            .then(res => this.logger.debug('Successfully created test card:', res))
            .catch(err => this.logger.debug('Failed to create test card:', err));   
    }
}