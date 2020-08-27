import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { setGreaseDisplay } from '../../core/store/actions/';
import { GreaseStatusComponent } from './grease-status.component';

describe('GreaseStatusComponent', () => {
  let component: GreaseStatusComponent;
  let fixture: ComponentFixture<GreaseStatusComponent>;
  let mockStore: MockStore;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatCheckboxModule,
        provideTranslocoTestingModule({}),
        AgGridModule.withComponents([]),
        ReactiveComponentModule,
      ],
      providers: [
        provideMockStore({
          initialState: {
            greaseStatus: {
              loading: false,
              result: undefined,
              display: {
                waterContentPercent: true,
                deteriorationPercent: true,
                temperatureCelsius: true,
                rotationalSpeed: true,
              },
            },
          },
        }),
      ],
      declarations: [GreaseStatusComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockStore = TestBed.inject(MockStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idx = 5;

      const result = component.trackByFn(idx, {});

      expect(result).toEqual(idx);
    });
  });

  describe('Display Form', () => {
    test('should dispatch setGreaseAction on valueChanges', () => {
      const mockGreaseDisplay = {
        waterContentPercent: true,
        deteriorationPercent: true,
        temperatureCelsius: true,
        rotationalSpeed: false,
      };

      mockStore.dispatch = jest.fn();

      component.displayForm.markAsDirty();
      component.displayForm.patchValue({ rotationalSpeed: false });

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        setGreaseDisplay({ greaseDisplay: mockGreaseDisplay })
      );
    });
  });
});
