import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AppState } from './store'
import { LoggingService } from './features/shared';

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
export class AppComponent implements OnInit {
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
        private logger: LoggingService,
        private store: Store<AppState>
    ) { }

    ngOnInit() {
        this.store
            .select(s => s.error.lastError)
            .filter(e => e)
            .subscribe(error => {
                this.logger.error(error);
                alert(error);
            });
    }

    activateEvent(event) {
        this.logger.debug('Activate Event:', event);
    }

    deactivateEvent(event) {
        this.logger.debug('Deactivate Event:', event);
    }
}
