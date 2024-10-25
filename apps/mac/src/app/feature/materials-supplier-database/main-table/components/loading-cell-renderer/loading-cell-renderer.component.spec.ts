import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ILoadingCellRendererParams } from 'ag-grid-community';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../../../../../../assets/i18n/en.json';
import { LoadingCellRendererComponent } from './loading-cell-renderer.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn(() => 'translation'),
}));

describe('LoadingCellRendererComponent', () => {
  let component: LoadingCellRendererComponent;
  let spectator: Spectator<LoadingCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: LoadingCellRendererComponent,
    imports: [provideTranslocoTestingModule({ en })],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.agInit({ node: {} } as ILoadingCellRendererParams);
    spectator.detectChanges();
  });

  describe('agInit', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('params not empty', () => {
      expect(component.params).not.toBeNull();
    });
  });
});
