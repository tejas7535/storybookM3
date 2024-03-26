import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { CopyInputComponent } from './copy-input.component';

describe('CopyInputComponent', () => {
  let component: CopyInputComponent;
  let spectator: Spectator<CopyInputComponent>;

  const createComponent = createComponentFactory({
    component: CopyInputComponent,
    imports: [
      MatIconTestingModule,

      MockModule(NoopAnimationsModule),
      MockModule(MatButtonModule),

      MockModule(MatInputModule),
      MockModule(MatFormFieldModule),
      MockModule(MatTooltipModule),
      MockModule(MatSnackBarModule),
    ],
    providers: [
      {
        provide: DecimalPipe,
        useValue: {
          transform: jest.fn(() => '1'),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('get transformedValue', () => {
    it('should return the tranformed value', () => {
      component.value = 5;

      const result = component.transformedValue;

      expect(result).toBe('1');
      expect(component['decimalPipe'].transform).toHaveBeenCalledWith(
        5,
        '1.0-0'
      );
    });
  });

  describe('onCopyButtonClick', () => {
    it('should copy the value and open a snackbar', () => {
      component['clipboard'].copy = jest.fn();
      component['snackbar'].open = jest.fn();
      component.unit = 'G-UNIT';

      component.onCopyButtonClick();

      expect(component['clipboard'].copy).toHaveBeenCalledWith('1\u00A0G-UNIT');
      expect(component['snackbar'].open).toHaveBeenCalledWith(
        'Value copied to clipboard',
        'Close',
        { duration: 5000 }
      );
    });
  });
});
