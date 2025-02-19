import { MatDividerModule } from '@angular/material/divider';

import { CalculationResultPreviewItem } from '@ea/core/store/models';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { CalculationPreviewErrorsItemComponent } from './calculation-preview-errors-item.component';

describe('CalculationPreviewErrorsItemComponent', () => {
  let spectator: Spectator<CalculationPreviewErrorsItemComponent>;
  const createComponent = createComponentFactory({
    component: CalculationPreviewErrorsItemComponent,
    imports: [MatDividerModule, provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        previewItems: [
          {
            title: 'Item 1',
          } as Partial<CalculationResultPreviewItem> as CalculationResultPreviewItem,
          {
            title: 'Item 2',
          } as Partial<CalculationResultPreviewItem> as CalculationResultPreviewItem,
        ],
        errors: ['Error 1', 'Error 2'],
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display preview items', () => {
    const previewItems = spectator.queryAll('span');
    expect(previewItems.length).toBe(2);
    expect(previewItems[0]).toHaveText('Item 1');
    expect(previewItems[1]).toHaveText('Item 2');
  });

  it('should display errors', () => {
    const errorItems = spectator.queryAll('li');
    expect(errorItems.length).toBe(2);
    expect(errorItems[0]).toHaveText('Error 1');
    expect(errorItems[1]).toHaveText('Error 2');
  });

  it('should display dividers between preview items', () => {
    const dividers = spectator.queryAll('mat-divider');
    expect(dividers.length).toBe(2); // Two dividers, but the last one should be hidden
    expect(dividers[0]).not.toHaveClass('!hidden');
    expect(dividers[1]).toHaveClass('!hidden');
  });

  it('should not display content if there are no errors and preview items', () => {
    spectator.setInput('previewItems', []);
    spectator.setInput('errors', []);
    spectator.detectChanges();

    const content = spectator.query('div');
    expect(content).toBeNull();
  });
});
