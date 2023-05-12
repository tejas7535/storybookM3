import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { of } from 'rxjs';

import { ApprovalLevel } from '@gq/shared/models/quotation';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { marbles } from 'rxjs-marbles';

import { APPROVAL_STATE_MOCK } from '../../../../../testing/mocks';
import { ReleaseModalApproverSelectComponent } from './release-modal-approver-select.component';

describe('ReleaseModalApproverSelectComponent', () => {
  let component: ReleaseModalApproverSelectComponent;
  let spectator: Spectator<ReleaseModalApproverSelectComponent>;

  const createComponent = createComponentFactory({
    component: ReleaseModalApproverSelectComponent,
    imports: [MatAutocompleteModule, PushModule],

    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onInit', () => {
    test(
      'should set',
      marbles((m) => {
        component.addSubscription = jest.fn();
        component.approvers$ = m.cold('a', {
          a: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });
        component.ngOnInit();
        m.expect(component.filteredOptions$).toBeObservable('b', {
          b: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });
      })
    );
    test('should call addSubscription', () => {
      component.addSubscription = jest.fn();
      component.ngOnInit();
      expect(component.addSubscription).toHaveBeenCalled();
    });
  });

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
    test(
      'should filter for "st"',
      marbles((m) => {
        component.height = 0;
        component.filteredOptions$ = m.cold('a', {
          a: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });

        component.approverSelectFormControl = {
          valueChanges: of('st'),
        } as unknown as FormControl;
        component.addSubscription();

        m.expect(component.filteredOptions$).toBeObservable('b', {
          b: [
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
          ],
        });
        component.filteredOptions$.subscribe(() =>
          expect(component.height).toBe(150)
        );
      })
    );
    test(
      'should filter and return more than 5 items',
      marbles((m) => {
        component.height = 0;
        component.filteredOptions$ = m.cold('a', {
          a: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });

        component.approverSelectFormControl = {
          valueChanges: of('L1'),
        } as unknown as FormControl;
        component.addSubscription();

        m.expect(component.filteredOptions$).toBeObservable('b', {
          b: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });
        component.filteredOptions$.subscribe(() =>
          expect(component.height).toBe(250)
        );
      })
    );
    test(
      'should filter for empty string and return complete list',
      marbles((m) => {
        component.filteredOptions$ = m.cold('a', {
          a: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });

        component.approverSelectFormControl = {
          valueChanges: of(),
        } as unknown as FormControl;
        component.addSubscription();

        m.expect(component.filteredOptions$).toBeObservable('b', {
          b: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });
      })
    );
  });

  describe('approverSelected', () => {
    test(
      'should return complete list when item of list has been selected',
      marbles((m) => {
        component.filteredOptions$ = m.cold('a', {
          a: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });

        component.approverSelectFormControl = {
          valueChanges: of({
            userId: 'herpisef',
            firstName: 'Stefan',
            lastName: 'Herpich',
            approvalLevel: ApprovalLevel.L1,
          }),
        } as unknown as FormControl;
        component.addSubscription();
        m.expect(component.filteredOptions$).toBeObservable('b', {
          b: APPROVAL_STATE_MOCK.approvers.map((item) => ({
            ...item,
            approvalLevel: ApprovalLevel.L1,
          })),
        });
      })
    );
  });
  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
