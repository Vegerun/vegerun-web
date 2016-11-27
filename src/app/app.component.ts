import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Logger } from './services/logger';

import { MOBILE } from './services/constants';

const views: Object[] = [
    {
        name: 'Dashboard',
        icon: 'home',
        link: ['']
    },
    {
        name: 'Lazy',
        icon: 'file_download',
        link: ['lazy']
    },
    {
        name: 'Sync',
        icon: 'done',
        link: ['sync']
    },
    {
        name: 'Bad Link',
        icon: 'error',
        link: ['wronglink']
    }
];

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.css'],
    templateUrl: './app.component.html'
})
export class AppComponent {
    showMonitor = (
        ENV === 'development' &&
        !AOT &&
        ['monitor', 'both'].includes(STORE_DEV_TOOLS) &&
        false
    );
    mobile = !MOBILE;
    sideNavMode = MOBILE ? 'over' : 'side';
    views = views;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private logger: Logger
    ) { }

    activateEvent(event) {
        this.logger.debug('Activate Event:', event);
    }

    deactivateEvent(event) {
        this.logger.debug('Deactivate Event:', event);
    }
}
