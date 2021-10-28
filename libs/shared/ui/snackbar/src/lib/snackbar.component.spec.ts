import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { SnackBarData } from './snackbar-data.model';
import { SnackBarType } from './snackbar-type.enum';
import { SnackBarComponent } from './snackbar.component';

const successConfig = new SnackBarData(
  'message',
  'action',
  SnackBarType.SUCCESS
);
const warningConfig = new SnackBarData(
  'message',
  'action',
  SnackBarType.WARNING
);
const errorConfig = new SnackBarData('message', 'action', SnackBarType.ERROR);
const infoConfig = new SnackBarData(
  'message',
  'action',
  SnackBarType.INFORMATION
);

describe('SnackBarComponent', () => {
  let spectator: Spectator<SnackBarComponent>;
  let component: SnackBarComponent;

  const componentFactoryObject = {
    component: SnackBarComponent,
    imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
    providers: [
      { provide: MAT_SNACK_BAR_DATA, useValue: successConfig },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  };

  const createComponent = createComponentFactory(componentFactoryObject);

  describe('General Tests', () => {
    beforeEach(() => {
      spectator = createComponent();
      component = spectator.component;
    });

    test('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('Properties and Inputs', () => {
      test('should define the properties', () => {
        expect(component.data).toBeDefined();
        expect(component.action).toBeDefined();
        expect(component.icon).toEqual('check_circle');
      });
    });

    describe('#clickActionButton()', () => {
      test('should emit dismiss event', () => {
        const spy = jest.spyOn(component.action, 'emit');

        component.clickActionButton();

        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('template test', () => {
    describe('snackbar of type success', () => {
      beforeEach(() => {
        spectator = createComponent({
          providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: successConfig }],
        });
      });
      test('should have correct icon', () => {
        const matIcon = spectator.query('mat-icon');

        expect(matIcon).toHaveTextContent('check_circle');
      });
    });

    describe('snackbar of type warning', () => {
      beforeEach(() => {
        spectator = createComponent({
          providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: warningConfig }],
        });
      });

      test('should have correct icon', () => {
        const matIcon = spectator.query('mat-icon');

        expect(matIcon).toHaveTextContent('warning');
      });
    });

    describe('snackbar of type error', () => {
      beforeEach(() => {
        spectator = createComponent({
          providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: errorConfig }],
        });
      });

      test('should have correct icon', () => {
        const matIcon = spectator.query('mat-icon');

        expect(matIcon).toHaveTextContent('warning');
      });
    });

    describe('snackbar of type information', () => {
      beforeEach(() => {
        spectator = createComponent({
          providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: infoConfig }],
        });
      });

      test('should have correct icon', () => {
        const matIcon = spectator.query('mat-icon');

        expect(matIcon).toHaveTextContent('info');
      });
    });
  });
});
