import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { CustomerMenuItemResultV2 } from '../../vegerun-2-client';

@Component({
    selector: 'app-menu-item-list',
    templateUrl: './menu-item-list.component.html',
    styleUrls: ['./menu-item-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemListComponent {
    @Input() menuItems: CustomerMenuItemResultV2[];
}