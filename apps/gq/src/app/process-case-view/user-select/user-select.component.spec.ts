import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';

import * as rxjs from 'rxjs';
import { of } from 'rxjs';

import { ActiveDirectoryUser } from '@gq/shared/models';
import { ApprovalLevel, Approver } from '@gq/shared/models/approval';
import * as autocompleteSelectValidator from '@gq/shared/validators/autocomplete-value-selected-validator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { marbles } from 'rxjs-marbles';

import { APPROVAL_STATE_MOCK } from '../../../testing/mocks';
import { UserSelectComponent } from './user-select.component';

describe('UserSelectComponent', () => {
  let component: UserSelectComponent;
  let spectator: Spectator<UserSelectComponent>;

  const createComponent = createComponentFactory({
    component: UserSelectComponent,
    imports: [MatAutocompleteModule, PushModule, ReactiveFormsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    jest.resetAllMocks();
    jest
      .spyOn(autocompleteSelectValidator, 'autocompleteValueSelectedValidator')
      .mockImplementation();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  test(
    'should set users',
    marbles((m) => {
      const calculateHeightOfAutoCompletePanelSpy = jest.spyOn(
        component as any,
        'calculateHeightOfAutoCompletePanel'
      );

      component.users$ = m.cold('a', {
        a: APPROVAL_STATE_MOCK.approvers.map((item) => ({
          ...item,
          approvalLevel: ApprovalLevel.L1,
        })),
      });

      m.expect(component.filteredOptions$).toBeObservable('b', {
        b: APPROVAL_STATE_MOCK.approvers.map((item) => ({
          ...item,
          approvalLevel: ApprovalLevel.L1,
        })),
      });

      m.expect(component.users$).toBeObservable('b', {
        b: APPROVAL_STATE_MOCK.approvers.map((item) => ({
          ...item,
          approvalLevel: ApprovalLevel.L1,
        })),
      });

      m.flush();

      expect(calculateHeightOfAutoCompletePanelSpy).toHaveBeenCalledTimes(1);
    })
  );

  test('should call scrollToPosition', () => {
    component.virtualScroll = {
      scrollToIndex: jest.fn(),
    } as unknown as CdkVirtualScrollViewport;
    component.scrollToFirstPosition();
    expect(component.virtualScroll.scrollToIndex).toHaveBeenCalledTimes(2);
    expect(component.virtualScroll.scrollToIndex).toHaveBeenCalledWith(1);
    expect(component.virtualScroll.scrollToIndex).toHaveBeenCalledWith(0);
  });

  describe('filtering', () => {
    beforeEach(() => {
      component.userSelectFormControl = new FormControl('test');
      component.inputField = { nativeElement: {} as HTMLInputElement };

      jest
        .spyOn(component.userDisplayPipe, 'transform')
        .mockImplementation((user: ActiveDirectoryUser) => {
          const approver = user as Approver;

          return `${approver.userId} ${approver.firstName} ${
            approver.lastName
          } - ${ApprovalLevel[approver.approvalLevel]}`;
        });
    });

    test('should filter for "st"', (done) => {
      const searchExpression = 'st';
      const inputChangedSpy = jest.spyOn(component.inputChanged, 'emit');

      component.enableFiltering = true;
      component.height = 0;

      jest.spyOn(component, 'users$', 'get').mockReturnValue(
        of(
          APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          }))
        )
      );

      jest
        .spyOn(rxjs, 'fromEvent')
        .mockReturnValue(of({ target: { value: searchExpression } }));

      component.userSelectFormControl.addValidators = jest.fn();

      component.ngAfterViewInit();

      expect(component.userSelectFormControl.addValidators).toHaveBeenCalled();
      expect(inputChangedSpy).toHaveBeenCalledWith(searchExpression);
      expect(inputChangedSpy).toHaveBeenCalledTimes(1);
      component.filteredOptions$.subscribe(
        (filteredOptions: ActiveDirectoryUser[]) => {
          expect(filteredOptions).toEqual([
            {
              userId: 'herpisef',
              firstName: 'Stefan',
              lastName: 'Herpich',
              approvalLevel: ApprovalLevel.L1,
            },
            {
              userId: 'herpiseg',
              firstName: 'Stefan',
              lastName: 'Albert',
              approvalLevel: ApprovalLevel.L1,
            },
            {
              userId: 'schlesni',
              firstName: 'Stefanie',
              lastName: 'Schleer',
              approvalLevel: ApprovalLevel.L1,
            },
          ]);
          expect(component.height).toBe(150);
          done();
        }
      );
    });

    test('should filter and return more than 5 items', (done) => {
      component.enableFiltering = true;
      component.height = 0;

      jest.spyOn(component, 'users$', 'get').mockReturnValue(
        of(
          APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          }))
        )
      );

      jest
        .spyOn(rxjs, 'fromEvent')
        .mockReturnValue(of({ target: { value: 'L1' } }));

      component.ngAfterViewInit();

      component.filteredOptions$.subscribe(
        (filteredOptions: ActiveDirectoryUser[]) => {
          expect(filteredOptions).toEqual(
            APPROVAL_STATE_MOCK.approvers.map((item) => ({
              ...item,
              approvalLevel: ApprovalLevel.L1,
            }))
          );
          expect(component.height).toBe(250);
          done();
        }
      );
    });

    test('should filter for empty string and return complete list', (done) => {
      component.enableFiltering = true;
      component.userSelectFormControl = new FormControl(undefined);
      jest.spyOn(component, 'users$', 'get').mockReturnValue(
        of(
          APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          }))
        )
      );

      jest
        .spyOn(rxjs, 'fromEvent')
        .mockReturnValue(of({ target: { value: '' } }));

      component.userSelectFormControl.addValidators = jest.fn();

      component.ngAfterViewInit();

      expect(
        component.userSelectFormControl.addValidators
      ).not.toHaveBeenCalled();

      component.filteredOptions$.subscribe(
        (filteredOptions: ActiveDirectoryUser[]) => {
          expect(filteredOptions).toEqual(
            APPROVAL_STATE_MOCK.approvers.map((item) => ({
              ...item,
              approvalLevel: ApprovalLevel.L1,
            }))
          );
          done();
        }
      );
    });

    test('should not filter', () => {
      const searchExpression = 'test';
      const inputChangedSpy = jest.spyOn(component.inputChanged, 'emit');
      const filterSpy = jest.spyOn(component as any, '_filter');

      component.enableFiltering = false;

      jest
        .spyOn(rxjs, 'fromEvent')
        .mockReturnValue(of({ target: { value: searchExpression } }));

      component.ngAfterViewInit();

      expect(filterSpy).not.toHaveBeenCalled();
      expect(inputChangedSpy).toHaveBeenCalledWith(searchExpression);
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
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
});
