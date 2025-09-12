import { NodeEntry } from '@alfresco/js-api';
import { Subject } from 'rxjs';

export interface AddDatalinkDialogData {
  title?: string;
  nodeId: string;
  dataLink: any;
  confirm: Subject<NodeEntry[]>;
}
