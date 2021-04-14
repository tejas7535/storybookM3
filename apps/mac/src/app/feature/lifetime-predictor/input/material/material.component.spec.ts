import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as en from '../../../../../assets/i18n/en.json';
import { getHeatTreatmentList, getMaterialList } from './../../store';
import { MaterialComponent } from './material.component';

describe('MaterialComponent', () => {
  let component: MaterialComponent;
  let spectator: Spectator<MaterialComponent>;

  const mockMaterial = {
    name: 'Makrele',
    heatTreatment: 'Räuchern',
    hardness: 12,
    disabled: false,
  };

  const createComponent = createComponentFactory({
    component: MaterialComponent,
    declarations: [MaterialComponent],
    imports: [
      FormsModule,
      ReactiveFormsModule,
      MatInputModule,
      MatSelectModule,
      MatFormFieldModule,
      NoopAnimationsModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          materials: [mockMaterial],
        },
        selectors: [
          {
            selector: getMaterialList,
            value: [mockMaterial.name],
          },
          {
            selector: getHeatTreatmentList,
            value: [mockMaterial],
          },
        ],
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a displayFn method that returns accepts an object of type Material but returns its heatTreatement name', () => {
    expect(component.displayFn).toBeDefined();
    expect(component.displayFn()).toBe(undefined);
    expect(component.displayFn(mockMaterial)).toBe('Räuchern');
  });

  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
