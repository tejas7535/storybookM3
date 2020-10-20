import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { CaseViewComponent } from './case-view.component';
import { AutocompleteInputModule } from './create-case-dialog/autocomplete-input/autocomplete-input.module';
import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';
import { CreateCaseDialogModule } from './create-case-dialog/create-case-dialog.module';

describe('CaseViewComponent', () => {
  let component: CaseViewComponent;
  let fixture: ComponentFixture<CaseViewComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CaseViewComponent],
      imports: [
        MatDialogModule,
        NoopAnimationsModule,
        AutocompleteInputModule,
        CreateCaseDialogModule,
        provideTranslocoTestingModule({}),
        RouterTestingModule.withRoutes([]),
      ],
      providers: [provideMockStore({})],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: { entryComponents: [CreateCaseDialogComponent] },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
