import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { ActiveDirectoryUser } from '@gq/shared/models';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculatorMissingComponent } from './calculator-missing.component';

describe('CalculatorMissingComponent', () => {
  let component: CalculatorMissingComponent;
  let spectator: Spectator<CalculatorMissingComponent>;

  const createComponent = createComponentFactory({
    component: CalculatorMissingComponent,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(Rfq4ProcessFacade, {
        sendEmailRequestToMaintainCalculators: jest.fn(),
        maintainers$: of([]),
      }),
    ],
    detectChanges: false,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('modalData', {
      quotationDetail: {
        gqPositionId: '123',
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('closeDialog', () => {
    test('should emit cancelButtonClicked event', () => {
      component.cancelButtonClicked.emit = jest.fn();
      component.closeDialog();
      expect(component.cancelButtonClicked.emit).toHaveBeenCalled();
    });
  });

  describe('getMaintainer', () => {
    test('should return formatted maintainer string', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        userId: 'jdoe',
      } as ActiveDirectoryUser;
      const result = component.getMaintainer(user);
      expect(result).toBe('John Doe (JDOE)');
    });
  });

  describe('getMaintainers', () => {
    test('should return formatted maintainers string with "and" separator', () => {
      const user1 = {
        firstName: 'John',
        lastName: 'Doe',
        userId: 'jdoe',
      } as ActiveDirectoryUser;
      const user2 = {
        firstName: 'Peter',
        lastName: 'Lustig',
        userId: 'Plus',
      };

      const res = component.getMaintainers([user1, user2], 'and');

      expect(res).toEqual('John Doe (JDOE) and Peter Lustig (PLUS)');
    });
  });

  describe('sendEmail', () => {
    test('should call sendEmailRequestToMaintainCalculators with correct parameters', () => {
      component['rfq4ProcessesFacade'].sendEmailRequestToMaintainCalculators =
        jest.fn();
      component.closeDialog = jest.fn();
      component.sendEmail();
      expect(
        component['rfq4ProcessesFacade'].sendEmailRequestToMaintainCalculators
      ).toHaveBeenCalledWith({
        gqPositionId: '123',
      });
    });
  });
});
