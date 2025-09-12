import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AddDatalinkDialogData } from './datalink-add-data.interface';

@Component({
  selector: 'aqua-datalink-add-dialog',
  templateUrl: './datalink-add-dialog.component.html'
})
export class AddDatalinkDialogComponent {
  currentSelection: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: AddDatalinkDialogData) {}

  onSelect(items: any[]) {
    this.currentSelection = items;
  }

  onAddClicked() {
    this.data.confirm.next(this.currentSelection);
    this.data.confirm.complete();
  }
}
