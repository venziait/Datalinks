import { Component, Input, OnInit, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { DatalinkListComponent } from './datalink-list/datalink-list.component';
import { AppStore, SnackbarErrorAction } from '@alfresco/aca-shared/store';
import { CommonModule } from '@angular/common';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'aqua-datalink-manager',
  templateUrl: './datalink-manager.component.html',
  standalone: true,
  imports: [CommonModule, DatalinkListComponent]
})
export class DataLinkManagerComponent implements OnInit {
  @Input()
  nodeId: string;

  @ViewChild('datalinkList')
  datalinkList: DatalinkListComponent;

  /** Emitted when a permission list item is selected. */
  @Output()
  select: EventEmitter<any> = new EventEmitter();

  toggleStatus = false;

  constructor(private store: Store<AppStore>) {}

  ngOnInit() {}

  onSelect(selectionList: any[]) {
    this.select.emit(selectionList);
  }

  onError(errorMessage: string) {
    this.store.dispatch(new SnackbarErrorAction(errorMessage));
  }

  onUpdate() {
    this.datalinkList.reload();
  }

  openAddDatalinkDialog(event: Event) {
    this.datalinkList.openAddDatalinkDialog(event);
  }

  removeSelectionRows(event: Event) {
    this.datalinkList.deleteSelectRows(event);
  }
}
