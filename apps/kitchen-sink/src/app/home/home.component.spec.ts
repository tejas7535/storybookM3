import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslocoModule } from '@ngneat/transloco';
import { configureTestSuite } from 'ng-bullet';

import {
  SnackBarModule,
  SpeedDialFabModule
} from '@schaeffler/shared/ui-components';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let debugElement: DebugElement;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        BrowserAnimationsModule,
        MatSnackBarModule,
        SnackBarModule,
        SpeedDialFabModule,
        TranslocoModule
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    fixture.detectChanges();

    // TODO: Use Transloco Testing Module
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'en.NAVIGATION.HOME'
    );
  });

  describe('Snackbar', () => {
    it('should be opened upon openSnackbar method call', () => {
      const matSnackBar = TestBed.get(MatSnackBar);
      const spy = spyOn(matSnackBar, 'openFromComponent').and.returnValue({
        instance: { snackBarRef: {} }
      });

      component.openSnackbar();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('speedDialFabClicked', () => {
    it('should log clicked button key', () => {
      const key = 'edit';
      console.log = jest.fn();

      component.speedDialFabClicked(key);

      expect(console.log).toHaveBeenCalledWith(
        'Speed Dial FAB has been clicked:',
        key
      );
    });

    it('should toggle speedDialFabOpen on fab open', () => {
      const key = 'conversation';

      expect(component.speedDialFabOpen).toBeFalsy();

      component.speedDialFabClicked(key);

      expect(component.speedDialFabOpen).toBeTruthy();
    });

    it('should toggle speedDialFabOpen on fab close', () => {
      const key = 'cancel';
      component.speedDialFabOpen = true;

      component.speedDialFabClicked(key);

      expect(component.speedDialFabOpen).toBeFalsy();
    });
  });
});
