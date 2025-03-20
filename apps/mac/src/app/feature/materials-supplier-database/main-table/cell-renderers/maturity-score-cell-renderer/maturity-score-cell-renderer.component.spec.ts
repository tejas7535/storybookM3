import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockComponent, MockProvider } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { MsdDialogService } from '@mac/feature/materials-supplier-database/services';
import { HtmlTooltipComponent } from '@mac/shared/components/html-tooltip/html-tooltip.component';

import * as en from '../../../../../../assets/i18n/en.json';
import { MaturityInfoComponent } from '../../components/maturity-info/maturity-info.component';
import { EditCellRendererParams } from '../edit-cell-renderer/edit-cell-renderer-params.model';
import { MaturityScoreCellRendererComponent } from './maturity-score-cell-renderer.component';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual('@jsverse/transloco'),
  translate: jest.fn((key) => key),
}));

describe('MaturityScoreCellRendererComponent', () => {
  let component: MaturityScoreCellRendererComponent;
  let spectator: Spectator<MaturityScoreCellRendererComponent>;

  const createComponent = createComponentFactory({
    component: MaturityScoreCellRendererComponent,
    declarations: [
      MockComponent(MaturityInfoComponent),
      MockComponent(HtmlTooltipComponent),
    ],
    imports: [provideTranslocoTestingModule({ en })],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      provideMockActions(() => of()),
      // dependency for MaturityInfoComponent - cannot be mocked away...
      MockProvider(MsdDialogService),
    ],
    detectChanges: false,
  });

  const mockparams = {
    column: { getColId: () => 'x' },
    value: 77,
    data: { maturity: 9 },
  } as EditCellRendererParams;

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.agInit(mockparams);
    spectator.detectChanges();
  });

  describe('create', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });
    it('should have parameters', () => {
      expect(component.params).toEqual(mockparams);
    });
  });

  describe('refresh', () => {
    it('should return false', () => {
      expect(component.refresh()).toBe(false);
    });
  });
});
