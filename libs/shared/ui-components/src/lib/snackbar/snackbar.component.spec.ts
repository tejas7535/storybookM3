import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';

import { configureTestSuite } from 'ng-bullet';

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
  let component: SnackBarComponent;
  let fixture: ComponentFixture<SnackBarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatButtonModule, MatIconModule, MatSnackBarModule],
      declarations: [SnackBarComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: successConfig }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties and Inputs', () => {
    test('should define the properties', () => {
      expect(component.data).toBeDefined();
      expect(component.action).toBeDefined();
      expect(component.icon).toEqual('icon-toast-success');
    });
  });

  describe('#clickActionButton()', () => {
    test('should emit dismiss event', () => {
      const spy = spyOn(component.action, 'emit');

      component.clickActionButton();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('template test', () => {
    describe('snackbar of type success', () => {
      beforeAll(() => {
        TestBed.overrideProvider(MAT_SNACK_BAR_DATA, {
          useValue: successConfig
        });
      });

      test('should have correct icon', () => {
        const matIcon = fixture.debugElement.query(By.css('mat-icon'))
          .nativeElement;

        expect(matIcon).toHaveClass('icon-toast-success');
      });
    });

    describe('snackbar of type warning', () => {
      beforeAll(() => {
        TestBed.overrideProvider(MAT_SNACK_BAR_DATA, {
          useValue: warningConfig
        });
      });

      test('should have correct icon', () => {
        const matIcon = fixture.debugElement.query(By.css('mat-icon'))
          .nativeElement;

        expect(matIcon).toHaveClass('icon-toast-warning');
      });
    });

    describe('snackbar of type error', () => {
      beforeAll(() => {
        TestBed.overrideProvider(MAT_SNACK_BAR_DATA, { useValue: errorConfig });
      });

      test('should have correct icon', () => {
        const matIcon = fixture.debugElement.query(By.css('mat-icon'))
          .nativeElement;

        expect(matIcon).toHaveClass('icon-toast-error');
      });
    });

    describe('snackbar of type information', () => {
      beforeAll(() => {
        TestBed.overrideProvider(MAT_SNACK_BAR_DATA, { useValue: infoConfig });
      });

      test('should have correct icon', () => {
        const matIcon = fixture.debugElement.query(By.css('mat-icon'))
          .nativeElement;

        expect(matIcon).toHaveClass('icon-toast-information');
      });
    });
  });
});
