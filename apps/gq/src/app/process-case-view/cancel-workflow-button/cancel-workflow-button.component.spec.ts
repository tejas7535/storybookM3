import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Event, NavigationEnd } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of, Subject } from 'rxjs';

import { AppRoutePath } from '@gq/app-route-path.enum';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProcessCaseRoutePath } from '../process-case-route-path.enum';
import { CancelWorkflowButtonComponent } from './cancel-workflow-button.component';
import { CancelWorkflowModalComponent } from './cancel-workflow-modal/cancel-workflow-modal.component';

describe('CancelWorkflowButtonComponent', () => {
  let component: CancelWorkflowButtonComponent;
  let spectator: Spectator<CancelWorkflowButtonComponent>;

  const createComponent = createComponentFactory({
    component: CancelWorkflowButtonComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), RouterTestingModule],
    providers: [{ provide: MatDialog, useValue: {} }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnDestroy', () => {
    test('should emit', () => {
      component['shutdown$$'].next = jest.fn();
      component['shutdown$$'].complete = jest.fn();

      component.ngOnDestroy();

      expect(component['shutdown$$'].next).toHaveBeenCalled();
      expect(component['shutdown$$'].complete).toHaveBeenCalled();
    });
  });

  describe('isProcessCaseOverviewTabActive', () => {
    test('should be true if overview tab is active', () => {
      (component as any)['router'] = {
        url: `/${AppRoutePath.ProcessCaseViewPath}/${ProcessCaseRoutePath.OverviewPath}?q1=test1&q2=test2`,
        events: of(),
      };
      const checkIfOverviewTabIsActiveSpy = jest.spyOn(
        component as any,
        'checkIfOverviewTabIsActive'
      );

      component.ngOnInit();

      expect(checkIfOverviewTabIsActiveSpy).toBeCalledTimes(1);
      expect(component.isProcessCaseOverviewTabActive).toBe(true);
    });

    test('should be true if it is switched to overview tab', () => {
      const eventsSubject: Subject<Event> = new Subject();
      const checkIfOverviewTabIsActiveSpy = jest.spyOn(
        component as any,
        'checkIfOverviewTabIsActive'
      );

      (component as any)['router'] = {
        url: `/${AppRoutePath.ProcessCaseViewPath}/${ProcessCaseRoutePath.OverviewPath}?q1=test1&q2=test2`,
        events: eventsSubject.asObservable(),
      };

      component.ngOnInit();

      eventsSubject.next(new NavigationEnd(123, '', ''));
      eventsSubject.complete();

      expect(checkIfOverviewTabIsActiveSpy).toBeCalledTimes(2);
      expect(component.isProcessCaseOverviewTabActive).toBe(true);
    });
  });

  test('should open dialog', () => {
    const openMock = jest.fn();
    component['dialog'].open = openMock;

    component.openDialog();

    expect(openMock).toBeCalledTimes(1);
    expect(openMock).toHaveBeenCalledWith(CancelWorkflowModalComponent, {
      width: '634px',
      autoFocus: false,
    });
  });
});
