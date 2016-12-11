import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';

import { ScriptLoaderService } from './../../shared';

export const STRIPE_PUBLISHABLE_KEY = new OpaqueToken('STRIPE_PUBLISHABLE_KEY');

@Injectable()
export class StripeService {

    private stripeLoadedPromise: Promise<void>;

    constructor(
        private scriptLoaderService: ScriptLoaderService,
        @Optional() @Inject(STRIPE_PUBLISHABLE_KEY) private stripePublishableKey?: string
    )
    {
        this.stripeLoadedPromise = scriptLoaderService.load('https://js.stripe.com/v2/')
            .then(() => Stripe.setPublishableKey(stripePublishableKey));
    }

    async createToken(data: StripeTokenData): Promise<StripeTokenResponse> {
        await this.stripeLoadedPromise;
        return new Promise<StripeTokenResponse>((resolve, reject) => {
            Stripe.createToken(data, (status, response) => {
                if (status === 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            });
        });
    }
}