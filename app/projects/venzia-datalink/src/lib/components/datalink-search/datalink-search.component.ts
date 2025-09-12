import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { VenziaDatalinkRestService } from '../../services/venzia-datalink-rest.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'aqua-datalink-search',
  templateUrl: './datalink-search.component.html',
  styleUrls: ['./datalink-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  host: {
    class: 'aqua-datalink-search'
  }
})
export class DatalinkSearchComponent implements AfterContentInit, OnChanges {
  @ViewChild('panel')
  panel: ElementRef;

  @ContentChild(TemplateRef)
  template: TemplateRef<any>;

  /** Function that maps an option's value to its display value in the trigger. */
  @Input()
  displayWith: ((value: any) => string) | null = null;

  /** Maximum number of results to show in the search. */
  @Input()
  maxResults = 20;

  /** Number of results to skip from the results pagination. */
  @Input()
  skipResults = 0;

  /** Search term to use when executing the search. Updating this value will
   * run a new search and update the results.
   */
  @Input()
  searchTerm = '';

  @Input()
  connectorRest: any;

  /** CSS class for display. */
  @Input('class')
  set classList(classList: string) {
    if (classList?.length) {
      classList.split(' ').forEach((className) => (this._classList[className.trim()] = true));
      this._elementRef.nativeElement.className = '';
    }
  }

  /** Emitted when search results have fully loaded. */
  @Output()
  resultLoaded: EventEmitter<any> = new EventEmitter();

  /** Emitted when an error occurs. */
  @Output()
  error: EventEmitter<any> = new EventEmitter();

  showPanel = false;
  results: any;

  get isOpen(): boolean {
    return this._isOpen && this.showPanel;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;
  }

  _isOpen = false;

  keyPressedStream: Subject<string> = new Subject();

  _classList: { [key: string]: boolean } = {};

  constructor(private searchService: VenziaDatalinkRestService, private _elementRef: ElementRef) {
    this.keyPressedStream
      .asObservable()
      .pipe(debounceTime(200))
      .subscribe((searchedWord: string) => {
        this.loadSearchResults(searchedWord);
      });
  }

  ngAfterContentInit() {
    this.setVisibility();
  }

  ngOnChanges(changes) {
    if (changes.searchTerm?.currentValue) {
      this.loadSearchResults(changes.searchTerm.currentValue);
    }
  }

  resetResults() {
    this.cleanResults();
    this.setVisibility();
  }

  reload() {
    this.loadSearchResults(this.searchTerm);
  }

  private loadSearchResults(searchTerm?: string) {
    this.resetResults();
    if (searchTerm) {
      const filters = { limit: this.maxResults };
      let apiRest: Observable<any>;
      filters[this.connectorRest.searchParam] = searchTerm;

      if (this.connectorRest.authentication.type === 'basic') {
        const authdata = window.btoa(this.connectorRest.authentication.username + ':' + this.connectorRest.authentication.password);
        apiRest = this.searchService.callApi(this.connectorRest.url, filters, authdata);
      } else {
        apiRest = this.searchService.callApi(this.connectorRest.url, filters);
      }

      apiRest.subscribe(
        (result) => this.onSearchDataLoaded(result),
        (err) => this.onSearchDataError(err)
      );
    } else {
      this.cleanResults();
    }
  }

  private cleanResults() {
    if (this.results) {
      this.results = {};
    }
  }

  onSearchDataLoaded(results: any) {
    if (results) {
      this.results = results;
      this.resultLoaded.emit(this.results);
      this.isOpen = true;
      this.setVisibility();
    }
  }

  onSearchDataError(error) {
    if (error && error.status !== 400) {
      this.results = null;
      this.error.emit(error);
    }
  }

  hidePanel() {
    if (this.isOpen) {
      this._classList['adf-search-show'] = false;
      this._classList['adf-search-hide'] = true;
      this.isOpen = false;
    }
  }

  setVisibility() {
    this.showPanel = !!this.results;
    this._classList['adf-search-show'] = this.showPanel;
    this._classList['adf-search-hide'] = !this.showPanel;
  }
}
