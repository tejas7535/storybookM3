import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { GlobalSelectionUtils } from './global-selection.utils';
import { Region } from './model';

const testGlobalSelection: GlobalSelectionState = {
  region: [{ id: Region.Europe, text: 'Europe' }],
  salesArea: [],
  sectorManagement: [],
  salesOrg: [{ id: '0013', text: 'Schaeffler Japan' }],
  gkamNumber: [],
  customerNumber: [],
  materialNumber: [],
  materialClassification: [],
  sector: [],
  productionPlant: [],
  productionSegment: [],
  alertType: [],
};

describe('globalSelectionCriteriaModel', () => {
  it('creates the correct filter object from global selection criteria', () => {
    const filter =
      GlobalSelectionUtils.globalSelectionCriteriaToFilter(testGlobalSelection);

    expect(filter).not.toBeNull();
    expect(filter?.region).toEqual([Region.Europe]);
    expect(filter?.salesOrg).toEqual(['0013']);
    expect(filter && Object.keys(filter)).toEqual(['region', 'salesOrg']);
  });
});
