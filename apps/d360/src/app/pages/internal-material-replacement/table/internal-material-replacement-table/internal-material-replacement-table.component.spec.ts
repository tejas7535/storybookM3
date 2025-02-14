import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { AgGridModule } from 'ag-grid-angular';
import { MockModule } from 'ng-mocks';

import { Region } from '../../../../feature/global-selection/model';
import { IMRService } from '../../../../feature/internal-material-replacement/imr.service';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';
import { InternalMaterialReplacementTableComponent } from './internal-material-replacement-table.component';

describe('InternalMaterialReplacementTableComponent', () => {
  let spectator: Spectator<InternalMaterialReplacementTableComponent>;

  const createComponent = createComponentFactory({
    component: InternalMaterialReplacementTableComponent,
    imports: [MockModule(AgGridModule)],
    providers: [
      mockProvider(IMRService),
      mockProvider(AgGridLocalizationService, {
        lang: jest.fn(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        selectedRegion: Region.Europe,
      },
    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
