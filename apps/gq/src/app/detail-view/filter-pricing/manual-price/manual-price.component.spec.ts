import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { KeyName } from '@ag-grid-community/all-modules';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { ManualPriceComponent } from './manual-price.component';

describe('ManualPriceComponent', () => {
  let component: ManualPriceComponent;
  let spectator: Spectator<ManualPriceComponent>;

  const createComponent = createComponentFactory({
    component: ManualPriceComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      MatIconModule,
      MatInputModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({}),
    ],
    providers: [provideMockStore({})],
    declarations: [ManualPriceComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('selectPrice', () => {
    test('should emit Output EventEmitter', () => {
      component.selectManualPrice.emit = jest.fn();
      component.manualPriceFormControl = { value: 1 } as any;

      component.selectPrice();

      expect(component.selectManualPrice.emit).toHaveBeenCalledWith(1);
    });
  });

  describe('Input setter', () => {
    test('should set manualPricePermission', () => {
      component.manualPricePermission = true;
      expect(component.manualPriceFormControl).toBeDefined();
      expect(component.manualPriceFormControl.disabled).toBe(false);
    });
  });

  describe('onKeyPress', () => {
    test('should prevent Default', () => {
      const event = { key: 0, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20.022 };

      component.onKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
    test('should prevent Default', () => {
      const event = { key: 0, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20 };

      component.onKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });

    test('should not prevent Default', () => {
      const event = { key: KeyName.DELETE, preventDefault: jest.fn() } as any;
      const manualPriceInput = { value: 20.022 };

      component.onKeyPress(event, manualPriceInput);

      expect(event.preventDefault).toHaveBeenCalledTimes(0);
    });
  });

  describe('onPaste', () => {
    test('should set price', () => {
      const event = {
        clipboardData: {
          getData: jest.fn(() => 20.022),
        },
        preventDefault: jest.fn(),
      } as any;
      component.manualPriceFormControl = { setValue: jest.fn() } as any;

      component.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledTimes(
        1
      );
      expect(component.manualPriceFormControl.setValue).toHaveBeenCalledWith(
        20.02
      );
    });
  });
});
