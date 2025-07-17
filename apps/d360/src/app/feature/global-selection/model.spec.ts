import { GlobalSelectionState } from '../../shared/components/global-selection-criteria/global-selection-state.service';
import { GlobalSelectionUtils } from './global-selection.utils';
import { allRegions, Region } from './model';

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

describe('allRegions', () => {
  it('should contain Europe, Grater China, Asia Pacific and Americas', () => {
    expect(allRegions).toContain(Region.Europe);
    expect(allRegions).toContain(Region.GreaterChina);
    expect(allRegions).toContain(Region.AsiaPacific);
    expect(allRegions).toContain(Region.Americas);
    expect(allRegions.length).toBe(4);
  });
});
