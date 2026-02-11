import { Component, Input, OnChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import { Node, SiteEntry } from '@alfresco/js-api';
import { DataColumnComponent, DataColumnListComponent, DataTableComponent, EmptyListComponent, LogService } from '@alfresco/adf-core';
import { ContentApiService } from '@alfresco/aca-shared';
import { NodesApiService } from '@alfresco/adf-content-services';
import { VenziaDatalinkApiService } from '../../services/venzia-datalink-api.service';
import { VenziaDatalinkSearchDialogService } from '../../services/venzia-datalink-search-dialog.service';
import { Store } from '@ngrx/store';
import { SnackbarErrorAction, AppStore } from '@alfresco/aca-shared/store';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ArraySortPipe } from '../../pipes/order-by.pipe';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent,
    MatProgressBarModule,
    MatTabsModule,
    DataColumnListComponent,
    DataColumnComponent,
    EmptyListComponent,
    TranslateModule,
    ArraySortPipe
  ],
  selector: 'aqua-datalink-list',
  templateUrl: './datalink-list.component.html',
  styleUrls: ['./datalink-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatalinkListComponent implements OnChanges {
  rows: any = {};
  datalinkList: any;
  datalinkActiveIndex = 0;
  /** ID of the node whose permissions you want to show. */
  @Input()
  nodeId = '';

  @Input()
  node: Node;

  /** Emitted when a permission list item is selected. */
  @Output()
  select: EventEmitter<any> = new EventEmitter();

  /** Emitted when an error occurs. */
  @Output()
  error: EventEmitter<any> = new EventEmitter();

  /** Emitted when an error occurs. */
  @Output()
  reloadDialog: EventEmitter<any> = new EventEmitter();

  isLoading = false;
  displayNode: Node | SiteEntry;

  selectedItems: any[] = [];

  constructor(
    private store: Store<AppStore>,
    private contentApi: ContentApiService,
    private nodesApiService: NodesApiService,
    private dlnkApiService: VenziaDatalinkApiService,
    private datalinkSearchDialogService: VenziaDatalinkSearchDialogService,
    private logger: LogService
  ) {}

  ngOnChanges() {
    this.isLoading = true;

    this.dlnkApiService.loadDataLink().subscribe((data) => {
      this.logger.debug(data);
      this.datalinkList = data;
      this.loadNodeInfo(this.nodeId);
    });
  }

  private loadNodeInfo(nodeId: string) {
    if (nodeId) {
      this.contentApi.getNodeInfo(nodeId).subscribe(
        (entity) => {
          this.setDisplayNode(entity);
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    }
  }

  onChangeTabIndex(index: number) {
    this.datalinkActiveIndex = index;
    this.selectedItems = [];
  }

  elementClicked(event: any) {
    this.updateItems(event);
  }

  elementUnClicked(event: any) {
    this.updateItems(event);
  }

  private updateItems(event: any) {
    this.selectedItems = event.detail.selection;
    this.select.emit(this.selectedItems);
  }

  private setDisplayNode(node: Node) {
    this.displayNode = node;
    for (const dataLink of this.datalinkList) {
      // if (this.displayNode.properties.hasOwnProperty(dataLink.aspectPropertyName)) {
        if (this.displayNode.properties.hasOwnProperty(dataLink.aspectPropertyName)) {
          this.rows[dataLink.aspectPropertyName] = JSON.parse(this.displayNode.properties[dataLink.aspectPropertyName]);
        }
    }
  }

  private parseSelection(data: any, dataLink: any): Array<any> {
    const updateItems: Array<any> = [];
    for (const item of this.rows[dataLink.aspectPropertyName]) {
      if (item !== data) {
        updateItems.push(item);
      }
    }
    return updateItems;
  }

  public reload() {
    this.loadNodeInfo(this.nodeId);
  }

  public onRemoveRow(dataRow: any, dataLink: any) {
    const data = { properties: {} };
    data.properties[dataLink.aspectPropertyName] = JSON.stringify(this.parseSelection(dataRow.row.obj, dataLink));
    this.nodesApiService.updateNode(this.nodeId, data).subscribe(
      () => {
        this.loadNodeInfo(this.nodeId);
      },
      (error) => this.error.emit(error)
    );
  }

  public deleteSelectRows(_: Event) {
    this.datalinkSearchDialogService.deleteSelectRows(this.nodeId, this.selectedItems, this.datalinkList[this.datalinkActiveIndex]).subscribe(
      () => {
        this.reloadDialog.emit();
      },
      (error) => {
        this.store.dispatch(new SnackbarErrorAction(error));
      }
    );
  }

  openAddDatalinkDialog(_: Event) {
    this.datalinkSearchDialogService.updateNodeDatalinkByDialog(this.nodeId, this.datalinkList[this.datalinkActiveIndex]).subscribe(
      () => {},
      (error) => {
        this.store.dispatch(new SnackbarErrorAction(error));
      }
    );
  }

  onError(errorMessage: string) {
    this.store.dispatch(new SnackbarErrorAction(errorMessage));
  }
}
