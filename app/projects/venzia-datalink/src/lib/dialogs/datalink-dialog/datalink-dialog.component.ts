import { Component, Inject, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatalinkListComponent } from '../../components/datalink-list/datalink-list.component';
import { AppStore, SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { Store } from '@ngrx/store';

@Component({
  host: { class: 'aqua-datalink-dialog' },
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./datalink-dialog.component.scss'],
  templateUrl: './datalink-dialog.component.html'
})
export class DatalinkDialogComponent implements AfterViewInit {
  @ViewChild('datalinkList')
  datalinkList: DatalinkListComponent;

  nodeId: string;

  currentSelection: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialog: MatDialog,
    private store: Store<AppStore>
  ) {
    this.nodeId = data.nodeId;
  }

  ngAfterViewInit(){
    this.datalinkList.reloadDialog.subscribe(() => {
      this.reload();
    });
  }

  onSelect(selectionList: any[]) {
    this.currentSelection = selectionList;
  }

  onError(errorMessage: string) {
    this.store.dispatch(new SnackbarErrorAction(errorMessage));
  }
  /*
  onUpdate() {
    this.datalinkList.reload();
  }
  */
  openAddDataLinkDialog(event: Event) {
    this.datalinkList.openAddDatalinkDialog(event);
  }

  onRemoveSelectionRows(event: Event) {
    this.datalinkList.deleteSelectRows(event);
  }

  reload() {
    this.dialog.open(DatalinkDialogComponent, {
      data: { nodeId: this.nodeId },
      panelClass: 'aca-permissions-dialog-panel',
      width: '800px'
    });
  }
}
