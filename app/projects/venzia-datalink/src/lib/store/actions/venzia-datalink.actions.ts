import { Action } from '@ngrx/store';
import { NodeEntry } from '@alfresco/js-api';

export enum VenziaDatalinkActionTypes {
  DatalinkOpen = 'DATALINK_OPEN_ACTION'
}

export class DataLinkOpenAction implements Action {
  readonly type = VenziaDatalinkActionTypes.DatalinkOpen;
  constructor(public payload: NodeEntry) {}
}
