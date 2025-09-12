import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { DatalinkSearchComponent } from '../datalink-search/datalink-search.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  DataColumnComponent,
  DataColumnListComponent,
  DataTableComponent,
  EmptyListComponent,
  LoadingContentTemplateDirective
} from '@alfresco/adf-core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslateModule,
    DataTableComponent,
    DataColumnListComponent,
    DataColumnComponent,
    EmptyListComponent,
    LoadingContentTemplateDirective,
    MatProgressSpinnerModule,
    DatalinkSearchComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  selector: 'aqua-datalink-add-panel',
  templateUrl: './datalink-add-panel.component.html',
  styleUrls: ['./datalink-add-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatalinkAddPanelComponent {
  @ViewChild('search')
  search: DatalinkSearchComponent;

  @Input()
  dataLink: any;

  /** Emitted when a permission list item is selected. */
  @Output()
  select: EventEmitter<any> = new EventEmitter();

  searchInput: FormControl = new FormControl();
  searchedWord = '';
  debounceSearch = 200;

  selectedItems: any[] = [];

  results: any[] = [];

  constructor() {
    this.searchInput.valueChanges.pipe(debounceTime(this.debounceSearch)).subscribe((searchValue) => {
      this.searchedWord = searchValue;
      if (!searchValue) {
        this.search.resetResults();
      }
    });
  }

  elementUnClicked(event: any) {
    this.updateSelected(event);
  }

  elementClicked(event: any) {
    this.updateSelected(event);
  }

  private updateSelected(event: any) {
    this.selectedItems = event.detail.selection;
    this.select.emit(this.selectedItems);
  }

  clearSearch() {
    this.searchedWord = '';
    this.selectedItems.splice(0, this.selectedItems.length);
    this.search.resetResults();
  }
}
