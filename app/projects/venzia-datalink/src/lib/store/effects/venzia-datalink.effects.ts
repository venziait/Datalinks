import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { VenziaDatalinkService } from '../../services/venzia-datalink.service';
import { DataLinkOpenAction, VenziaDatalinkActionTypes } from '../actions/venzia-datalink.actions';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getAppSelection } from '@alfresco/aca-shared/store';
import { NotificationService } from '@alfresco/adf-core';

@Injectable()
export class VenziaDatalinkEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private venziaDatalinkService = inject(VenziaDatalinkService);
  private notificationService = inject(NotificationService);

  dataLinkDoc$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<DataLinkOpenAction>(VenziaDatalinkActionTypes.DatalinkOpen),
        map((action) => {
          if (action.payload) {
            this.venziaDatalinkService.dataLinkDoc(action.payload);
          } else {
            this.store
              .select(getAppSelection)
              .pipe(take(1))
              .subscribe((selection) => {
                if (!selection.isEmpty) {
                  this.venziaDatalinkService.dataLinkDoc(selection.first);
                } else {
                  this.notificationService.showError('DATALINK.MESSAGES.ERRORS.EMPTY_SELECTION');
                }
              });
          }
        })
      ),
    { dispatch: false }
  );
}
