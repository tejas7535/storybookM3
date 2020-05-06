import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared/shared.module';
import { FilterPanelModule } from './filter-panel/filter-panel.module';
import { ReferenceTypesFiltersModule } from './reference-types-filters/reference-types-filters.module';
import { ReferenceTypesTableModule } from './reference-types-table/reference-types-table.module';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SharedModule,
        provideTranslocoTestingModule({}),
        FilterPanelModule,
        ReferenceTypesFiltersModule,
        ReferenceTypesTableModule,
      ],
      declarations: [SearchComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
