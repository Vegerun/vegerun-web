import { Injectable } from '@angular/core';

@Injectable()
export class HostingEnvironment {

    get environmentName(): string {
        return ENV;
    }

    isDevelopment(): boolean {
        return this.environmentName === 'development';
    }
}
