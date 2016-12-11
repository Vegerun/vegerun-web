import { Injectable } from '@angular/core';
import * as scriptjs from 'scriptjs'

import { LoggingService } from './logging.service'


@Injectable()
export class ScriptLoaderService {

    constructor(
        private logger: LoggingService
    ) { }

    load(url: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            scriptjs.get(url, () => {
                this.logger.debug(`External script loaded from ${url}`);
                resolve();
            });
        });
    }
}