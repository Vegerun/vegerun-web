import { Injectable } from '@angular/core';

import { HostingEnvironment } from './hosting-environment';

@Injectable()
export class Logger {

    constructor(
        private hostingEnv: HostingEnvironment
    ) { }

    debug(message, ...optionalParams) {
        if (this.hostingEnv.isDevelopment()) {
            console.log(message, ...optionalParams);
        }
    }

    error(message, ...optionalParams) {
        console.error(message, ...optionalParams);
    }
}