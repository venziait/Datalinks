import { Injectable } from '@angular/core';
import { DatalinkDialogComponent } from '../dialogs/datalink-dialog/datalink-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@alfresco/adf-core';
import { NodeEntry } from '@alfresco/js-api';

@Injectable({
  providedIn: 'root'
})
export class VenziaDatalinkService {
  constructor(private dialogRef: MatDialog, private notificationService: NotificationService) {}

  dataLinkDoc(node: NodeEntry): void {
    // if (node?.entry && node?.entry.properties && node?.entry.isFile) {
    if (node?.entry && node?.entry.properties) {
      this.dialogRef.open(DatalinkDialogComponent, {
        data: { nodeId: node.entry.id },
        panelClass: 'aca-permissions-dialog-panel',
        width: '730px'
      });
    } else {
      this.notificationService.showError('DATALINK.MESSAGES.ERRORS.NO_PROPERTIES');
    }
  }
}
