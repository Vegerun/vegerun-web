import { Injectable } from '@angular/core';

import { EnvironmentHelper } from '../../../../helpers/environment.helper';

@Injectable()
export class LoggingService {

    debug(message, ...optionalParams) {
        if (EnvironmentHelper.isDevelopment()) {
            console.log(message, ...optionalParams);
        }
    }

    error(message, ...optionalParams) {
        console.error(message, ...optionalParams);
    }
}