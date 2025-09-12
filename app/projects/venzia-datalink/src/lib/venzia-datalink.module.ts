import { NgModule } from '@angular/core';
import { ExtensionService, provideExtensionConfig } from '@alfresco/adf-extensions';
import { TranslationService } from '@alfresco/adf-core';
import * as rules from '@venzia/venzia-datalink/rules';
import { VenziaDatalinkStoreModule } from './store';
import { DatalinkDialogComponent } from './dialogs/datalink-dialog/datalink-dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AddDatalinkDialogComponent } from './dialogs/datalink-add-dialog/datalink-add-dialog.component';
import { DatalinkListComponent } from './components/datalink-list/datalink-list.component';
import { DatalinkAddPanelComponent } from './components/datalink-add-panel/datalink-add-panel.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [DatalinkDialogComponent, AddDatalinkDialogComponent],
  imports: [
    VenziaDatalinkStoreModule,
    TranslateModule,
    MatDialogModule,
    MatIconModule,
    DatalinkListComponent,
    DatalinkAddPanelComponent,
    MatButtonModule
  ],
  exports: [],
  providers: [provideExtensionConfig(['venzia-datalink.plugin.json'])]
})
export class VenziaDatalinkModule {
  constructor(translation: TranslationService, extensions: ExtensionService) {
    translation.addTranslationFolder('datalink', 'assets/datalink');

    extensions.setEvaluators({
      'datalink.canDatalink': rules.canDatalink
    });
  }
}
