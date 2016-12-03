import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';

import { CustomerMenuResultV2, CustomerMenuItemResultV2 } from '../../vegerun-2-client';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {
    @Input() menu: CustomerMenuResultV2;
    @Output() onMenuItemSelected = new EventEmitter<CustomerMenuItemResultV2>();
}
