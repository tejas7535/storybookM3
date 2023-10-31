import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { PinDropDownDirective } from './pin-drop-down.directive';

describe('Directive: PinDropDown', () => {
  it('should create an instance', () => {
    const matTriggerMock = undefined as MatAutocompleteTrigger;
    const directive = new PinDropDownDirective(matTriggerMock);
    expect(directive).toBeTruthy();
  });

  it('should do nothing when trigger is undefined', () => {
    const matTriggerMock = undefined as MatAutocompleteTrigger;
    const directive: PinDropDownDirective = new PinDropDownDirective(
      matTriggerMock
    );

    directive['onContentScrolled']();

    expect(directive['autocomplete']).toBeFalsy();
  });

  it('should update position when panel is open', () => {
    const matTriggerMock = {
      updatePosition: jest.fn(),
      panelOpen: true,
    } as unknown as MatAutocompleteTrigger;
    const directive: PinDropDownDirective = new PinDropDownDirective(
      matTriggerMock
    );

    directive['onContentScrolled']();

    expect(matTriggerMock.updatePosition).toHaveBeenCalled();
  });

  it('should not update position when panel is closed', () => {
    const matTriggerMock = {
      updatePosition: jest.fn(),
      panelOpen: false,
    } as unknown as MatAutocompleteTrigger;
    const directive: PinDropDownDirective = new PinDropDownDirective(
      matTriggerMock
    );

    directive['onContentScrolled']();

    expect(matTriggerMock.updatePosition).not.toHaveBeenCalled();
  });

  it('should call onContentScrolled', () => {
    const matTriggerMock = {
      updatePosition: jest.fn(),
      panelOpen: false,
    } as unknown as MatAutocompleteTrigger;
    const directive: PinDropDownDirective = new PinDropDownDirective(
      matTriggerMock
    );
    Object.defineProperty(directive, 'onContentScrolled', { value: jest.fn() });

    directive.ngAfterViewInit();
    window.dispatchEvent(new Event('scroll'));
    directive.ngOnDestroy();

    expect(directive['onContentScrolled']).toHaveBeenCalled();
  });
});
