import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from './store';
import { AuthActions } from './features/auth';
import { LoggingService } from './features/shared';
import { AuthDialogComponent, AuthDialogMode } from './components/auth-dialog';

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

    private hasAuth$: Observable<boolean>;
    private authEmail$: Observable<string>;

    constructor(
        private mdDialog: MdDialog,
        private route: ActivatedRoute,
        private router: Router,
        private logger: LoggingService,
        private store: Store<AppState>,
        private authActions: AuthActions
    ) { }

    ngOnInit() {
        this.store
            .select(s => s.error.lastError)
            .filter(e => e)
            .subscribe(error => {
                this.logger.error(error);
                alert(error);
            });

        let auth$ = this.store.select(s => s.auth)
        this.hasAuth$ = auth$.map(state => !!state.accessToken);
        this.authEmail$ = auth$.map(state => state.email);
    }

    activateEvent(event) {
        this.logger.debug('Activate Event:', event);
    }

    deactivateEvent(event) {
        this.logger.debug('Deactivate Event:', event);
    }

    login() {
        let dialogRef = this.mdDialog.open(AuthDialogComponent);
        dialogRef.componentInstance.mode = AuthDialogMode.Login;
    }

    register() {
        let dialogRef = this.mdDialog.open(AuthDialogComponent);
        dialogRef.componentInstance.mode = AuthDialogMode.Register;
    }

    logout() {
        this.store.dispatch(this.authActions.logout());
    }
}
