import { NgModule } from '@angular/core';
import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { SnackBarComponent, SnackBarMessageType } from './snackbar.component';

@NgModule({
  imports: [MatIconModule],
  declarations: [SnackBarComponent],
  entryComponents: [SnackBarComponent]
})
class SnackBarTestModule {}

describe('In SnackBarComponent', () => {
  let component: SnackBarComponent;
  let fixture: ComponentFixture<SnackBarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatSnackBarModule,
        SnackBarTestModule
      ],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: MAT_SNACK_BAR_DATA }]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties and Inputs', () => {
    it('should define the properties', () => {
      expect(component.snackBarRef).toBeUndefined();
      expect(component.message).toBeDefined();
      expect(component.type).toBeDefined();
    });

    it('should define the default values', () => {
      expect(component.message).toBe('');
      expect(component.type).toBe(SnackBarMessageType.NOTIFICATION);
    });
  });

  describe('dismissSnackBar()', () => {
    it('should dismiss snackBarRef', inject(
      [MatSnackBar],
      (snackBar: MatSnackBar) => {
        const data = { message: 'Bla', type: SnackBarMessageType.ERROR };
        let dismissedCalled = false;

        component.snackBarRef = snackBar.openFromComponent(SnackBarComponent, {
          data
        });
        spyOn(component.snackBarRef, 'dismiss').and.callFake(() => {
          dismissedCalled = true;
        });

        component.dismissSnackBar();

        expect(component.snackBarRef['dismiss']).toHaveBeenCalled();
        expect(dismissedCalled).toBeTruthy();
      }
    ));

    it('should not close snackBar if reference is not given', inject(
      [MatSnackBar],
      (snackBar: MatSnackBar) => {
        const data = { message: 'Bla', type: SnackBarMessageType.ERROR };
        const snackBarInstance = snackBar.openFromComponent(SnackBarComponent, {
          data
        });
        let dismissedCalled = false;

        spyOn(snackBarInstance, 'dismiss').and.callFake(() => {
          dismissedCalled = true;
        });

        component.dismissSnackBar();

        expect(dismissedCalled).toBeFalsy();
      }
    ));
  });

  describe('snackBar of type', () => {
    it('success should have specific icon', async(() => {
      component.type = SnackBarMessageType.SUCCESS;
      fixture.detectChanges();

      const matIcon = fixture.debugElement.query(By.css('mat-icon'))
        .nativeElement;

      expect(matIcon).toHaveClass('icon-toast-success');
    }));

    it('error should have specific icon', async(() => {
      component.type = SnackBarMessageType.ERROR;
      fixture.detectChanges();

      const matIcon = fixture.debugElement.query(By.css('.mat-icon'))
        .nativeElement;

      expect(matIcon).toHaveClass('icon-toast-error');
    }));

    it('warning should have specific icon', async(() => {
      component.type = SnackBarMessageType.WARNING;
      fixture.detectChanges();

      const matIcon = fixture.debugElement.query(By.css('mat-icon'))
        .nativeElement;

      expect(matIcon).toHaveClass('icon-toast-warning');
    }));

    it('notification should have specific icon', async(() => {
      component.type = SnackBarMessageType.NOTIFICATION;
      fixture.detectChanges();

      const matIcon = fixture.debugElement.query(By.css('mat-icon'))
        .nativeElement;

      expect(matIcon).toHaveClass('icon-toast-information');
    }));
  });
});
