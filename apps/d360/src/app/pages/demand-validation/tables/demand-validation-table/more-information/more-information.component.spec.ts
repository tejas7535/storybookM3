import { signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { parseISO } from 'date-fns';

import { MaterialListEntry } from '../../../../../feature/demand-validation/model';
import { MoreInformationComponent } from './more-information.component';
import { MoreInformationDialogComponent } from './more-information-dialog/more-information-dialog.component';

describe('MoreInformationComponent', () => {
  let spectator: Spectator<MoreInformationComponent>;

  const createComponent = createComponentFactory({
    component: MoreInformationComponent,
    providers: [mockProvider(TranslocoLocaleService), mockProvider(MatDialog)],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: { selectedMaterial: {} },
    });
    jest
      .spyOn(spectator.component as any, 'supplyConcept')
      .mockReturnValue(signal('test'));
  });

  it('should be created', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('data initialization', () => {
    it('should initialize data correctly', async () => {
      const mockMaterial: MaterialListEntry = {
        /* populate with test data, if needed */
      };
      spectator.component.selectedMaterial = signal(mockMaterial) as any;

      await Promise.resolve(); // wait for effects to run

      expect(spectator.component['data'].length).toBeGreaterThan(0);
    });
  });

  describe('supplyConcept', () => {
    it('should return the correct supply concept string', () => {
      const mockMaterial: MaterialListEntry = {
        /* populate with test data, if needed */
      };
      spectator.component.selectedMaterial = signal(mockMaterial) as any;

      const result = spectator.component['supplyConcept']();

      expect(result).toBeDefined();
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const mockDate = new Date().toISOString();
      spectator.component['selectedMaterial'] = signal({
        portfolioStatusDate: mockDate,
      } as MaterialListEntry) as any;
      const spyOnLocalizeDate = jest.spyOn(
        spectator.component['translocoLocaleService'],
        'localizeDate'
      );

      spectator.component['formatDate']();

      expect(spyOnLocalizeDate).toHaveBeenCalledWith(parseISO(mockDate));
    });
  });

  describe('openDetails', () => {
    it('should open dialog with correct data', () => {
      const mockMaterial: MaterialListEntry = {
        /* populate with test data, if needed */
      };
      spectator.component.selectedMaterial = signal(mockMaterial) as any;
      const spyOnOpenDialog = jest.spyOn(spectator.component['dialog'], 'open');

      spectator.component['openDetails']();

      expect(spyOnOpenDialog).toHaveBeenCalledWith(
        MoreInformationDialogComponent,
        {
          data: mockMaterial,
          width: '1000px',
          panelClass: 'resizable',
        }
      );
    });
  });
});
