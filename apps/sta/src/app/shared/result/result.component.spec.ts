import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { ResultAutoTaggingComponent } from './result-auto-tagging/result-auto-tagging.component';
import { ResultTranslationComponent } from './result-translation/result-translation.component';
import { ResultComponent } from './result.component';

import { DataStoreService } from './services/data-store.service';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatChipsModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      declarations: [
        ResultComponent,
        ResultAutoTaggingComponent,
        ResultTranslationComponent
      ],
      providers: [DataStoreService]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should call setObservables', () => {
      const mock = (component['setObservables'] = jest.fn());

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('setObservables', () => {
    test('should define observables', () => {
      component['setObservables']();

      expect(component.tags$).toBeDefined();
      expect(component.translation$).toBeDefined();
    });
  });
});
