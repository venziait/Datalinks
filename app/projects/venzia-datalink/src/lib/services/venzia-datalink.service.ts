import { Injectable } from '@angular/core';
import { DatalinkDialogComponent } from '../dialogs/datalink-dialog/datalink-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@alfresco/adf-core';

@Injectable({
  providedIn: 'root'
})
export class VenziaDatalinkService {
  constructor(private dialogRef: MatDialog, private notificationService: NotificationService) {}

  dataLinkDoc(node: any): void {
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
