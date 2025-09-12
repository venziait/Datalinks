import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Node, NodeEntry } from '@alfresco/js-api';
import { NodesApiService } from '@alfresco/adf-content-services';
import { ContentApiService } from '@alfresco/aca-shared';
import { AddDatalinkDialogData } from '../dialogs/datalink-add-dialog/datalink-add-data.interface';
import { AddDatalinkDialogComponent } from '../dialogs/datalink-add-dialog/datalink-add-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class VenziaDatalinkSearchDialogService {
  constructor(private dialog: MatDialog, private nodesApiService: NodesApiService, private contentApi: ContentApiService) {}

  private getColumnPrimaryKey(dataLink: any): string {
    // find column index
    for (const col of dataLink.columns) {
      if (col.primaryKey) {
        return col.name;
      }
    }

    return undefined;
  }

  private parseRemoveRows(displayNode: Node, selectedRows: Array<any>, dataLink: any): Array<any> {
    let rows: Array<any> = [];
    const rowsToSave: Array<any> = [];
    const columnIndex: string = this.getColumnPrimaryKey(dataLink);

    // if (displayNode.properties.hasOwnProperty(dataLink.aspectPropertyName)) {
    if (Object.prototype.hasOwnProperty.call(displayNode, dataLink.aspectPropertyName)) {
      rows = JSON.parse(displayNode.properties[dataLink.aspectPropertyName]);
    }

    for (const item of rows) {
      let exist = false;
      for (const sel of selectedRows) {
        if (item[columnIndex] === sel.obj[columnIndex]) {
          exist = true;
        }
      }

      if (!exist) {
        rowsToSave.push(item);
      }
    }

    return rowsToSave;
  }

  deleteSelectRows(nodeId: string, deleteRows: Array<any>, dataLink: any): Observable<Node> {
    return this.contentApi.getNode(nodeId).pipe(
      switchMap((node) => {
        const data = { properties: {} };
        data.properties[dataLink.aspectPropertyName] = JSON.stringify(this.parseRemoveRows(node.entry, deleteRows, dataLink));
        return this.nodesApiService.updateNode(nodeId, data);
      })
    );
  }

  /**
   * Opens a dialog to add datalink to a node.
   * @param node ID of the target node
   * @param title Dialog title
   * @returns Node with updated permissions
   */
  openAddDatalinkDialog(node: Node, dataLink: any, title?: string): Observable<NodeEntry[]> {
    const confirm = new Subject<NodeEntry[]>();

    confirm.subscribe({
      complete: this.close.bind(this)
    });

    const data: AddDatalinkDialogData = {
      nodeId: node.id,
      dataLink: dataLink,
      title: title,
      confirm: confirm
    };

    this.openDialog(data, 'adf-add-permission-dialog', '630px');
    return confirm;
  }

  private openDialog(data: any, currentPanelClass: string, chosenWidth: string) {
    this.dialog.open(AddDatalinkDialogComponent, { data, panelClass: currentPanelClass, width: chosenWidth });
  }

  /**
   * Closes the currently-open dialog.
   */
  close() {
    this.dialog.closeAll();
  }

  private parseSelectionsRows(displayNode: Node, selectedRows: Array<any>, dataLink: any): Array<any> {
    let rows: Array<any> = [];
    const columnIndex: string = this.getColumnPrimaryKey(dataLink);

    // if (displayNode.properties.hasOwnProperty(dataLink.aspectPropertyName)){
    if (Object.prototype.hasOwnProperty.call(displayNode, dataLink.aspectPropertyName)) {
      rows = JSON.parse(displayNode.properties[dataLink.aspectPropertyName]);
    }

    for (const sel of selectedRows) {
      let exist = false;
      for (const item of rows) {
        if (item[columnIndex] === sel.obj[columnIndex]) {
          exist = true;
        }
      }

      if (!exist) {
        rows.push(sel.obj);
      }
    }

    return rows;
  }

  /**
   * Opens a dialog to update dtalink for a node.
   * @param nodeId ID of the target node
   * @param title Dialog title
   * @returns Node with updated datalink
   */
  updateNodeDatalinkByDialog(nodeId: string, dataLink: any, title?: string): Observable<Node> {
    return this.contentApi.getNode(nodeId).pipe(
      switchMap((node) => {
        return this.openAddDatalinkDialog(node.entry, dataLink, title).pipe(
          switchMap((selection) => {
            const data = { properties: {} };
            data.properties[dataLink.aspectPropertyName] = JSON.stringify(this.parseSelectionsRows(node.entry, selection, dataLink));
            return this.nodesApiService.updateNode(nodeId, data);
          })
        );
      })
    );
  }
}
