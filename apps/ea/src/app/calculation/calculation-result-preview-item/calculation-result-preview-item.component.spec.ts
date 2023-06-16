import { MatButtonModule } from '@angular/material/button';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { translate } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationResultPreviewItemComponent } from './calculation-result-preview-item.component';

describe('CalculationResultPreviewItemComponent', () => {
  let component: CalculationResultPreviewItemComponent;
  let spectator: Spectator<CalculationResultPreviewItemComponent>;

  const createComponent = createComponentFactory({
    component: CalculationResultPreviewItemComponent,
    imports: [
      // Material Modules
      MockModule(MatButtonModule),
      MatIconTestingModule,
      MockModule(MatTooltipModule),

      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      {
        provide: translate,
        useValue: jest.fn(),
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;

    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show different result items', () => {
    component.item = {
      icon: 'abc',
      title: 'abc',
      values: [
        { unit: 'abc', title: 'abc', value: 1, isLoading: false },
        { unit: 'abc', title: 'abc', value: 2, isLoading: false },
      ],
    };

    spectator.detectComponentChanges();

    // one main icon
    expect(spectator.queryAll('mat-icon').length).toBe(1);

    // two values + one title
    expect(spectator.queryAll('.text-caption').length).toBe(3);
  });
});
