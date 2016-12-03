import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

import { CustomerMenuItemResultV2 } from '../../vegerun-2-client';

@Component({
    selector: 'app-menu-item-list',
    templateUrl: './menu-item-list.component.html',
    styleUrls: ['./menu-item-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuItemListComponent {
    @Input() items: CustomerMenuItemResultV2[];
    @Output() onItemSelected = new EventEmitter<CustomerMenuItemResultV2>();

    selectItem(item: CustomerMenuItemResultV2) {
        if (item.isEnabled) {
            this.onItemSelected.emit(item);
        }
    }
}